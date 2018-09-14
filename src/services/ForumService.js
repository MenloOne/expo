import web3 from '../web3_override'
import TruffleContract from 'truffle-contract'
import TokenContract from 'menlo-token/build/contracts/MenloToken.json'

import ForumContract from '../truffle_artifacts/contracts/Forum.json'

import JavascriptIPFSStorage from '../storage/JavascriptIPFSStorage'
import RemoteIPFSStorage from '../storage/RemoteIPFSStorage'
import MessagesGraph from '../storage/MessageBoardGraph'

import HashUtils from '../HashUtils'


class Lottery {

    constructor( _forum, _name, _offsets, _winners, _rewardPool, _completed ) {
        this.forum = _forum
        this.name = _name
        this.offsets = _offsets
        this.winners = _winners
        this.rewardPool = _rewardPool / 10 ** 18
        this.completed = _completed
        this.claimed = {}
    }

    totalWinners() {
        return this.winners.length
    }

    winnings(i) {
        const r = this.rewardPool
        let me   = 0
        let rest = 0

        if (!r) {
            return null
        }

        if (i === 0) { me = r * 2 / 5; }
        if (i === 1) { me = r / 4; }
        if (i === 2) { me = r / 5; }
        if (i === 3) { me = r / 10; }
        if (i === 4) { me = r / 20; }

        /*
        Not implemented by contract yet

        if (this.totalWinners() < 2) { rest += r / 4 }
        if (this.totalWinners() < 3) { rest += r / 5 }
        if (this.totalWinners() < 4) { rest += r / 10 }
        if (this.totalWinners() < 5) { rest += r / 20 }
        */

        return me + rest / this.totalWinners()
    }

    async isClaimed(i) {
        let hash = await this.forum.payouts.call(i)
        this.claimed[i] = true

        return (hash === 0)
    }

    totalWinnings() {
        let totals = this.winners.map((a, i) => {
            if (a === this.forum.account) {
                if (!this.claimed[i]) {
                    return this.winnings(i)
                }
            }
            return 0
        })

        return totals.reduce((acc, cur) => acc + cur)
    }

    iWon() {
        return this.completed && this.winners.filter(a => a === this.forum.account).length > 0
    }

    async claimWinnings() {
        const claimPromises = this.winners.map((a,i) => {
            if (a === this.forum.account) {
                return this.forum.claim(i)
            }
            return null
        })

        await Promise.all(claimPromises)

        this.winners.map((a,i) => {
            if (a === this.forum.account) {
                this.claimed[i] = true
            }
            return 0
        })

        this.forum.refreshTokenBalance()
    }

}



class ForumService {


    constructor() {
        this.tokenContract = TruffleContract(TokenContract)
        this.forumContract = TruffleContract(ForumContract)

        this.forum = null;
        this.remoteStorage = new RemoteIPFSStorage('ipfs.menlo.one', '443', {protocol: 'https'}) // new RemoteIPFSStorage('/ip4/127.0.0.1/tcp/5001')
        this.localStorage = new JavascriptIPFSStorage()
        this.localStorage.connectPeer(this.remoteStorage)

        this.messages = new MessagesGraph()
        this.epoch = 0
        this.account = null;
        this.callbacks = {}
        this.newMessageOnging = null

        this.ready  = new Promise((resolve) => { this.signalReady = resolve })
        this.synced = new Promise((resolve) => { this.signalSynced = resolve })
    }

    async setAccount(acct) {
        try {
            this.account = acct.account
            this.refreshTokenBalance = acct.refreshBalance

            await this.tokenContract.setProvider(web3.currentProvider)
            this.tokenContract.defaults({
                from: this.account
            })
            this.token = await this.tokenContract.deployed()

            this.filledMessagesCounter = 0
            this.topicOffsets = {}
            this.topicHashes = []

            await this.forumContract.setProvider(web3.currentProvider)
            this.forumContract.defaults({
                from: this.account
            })
            this.forum = await this.forumContract.deployed();

            const [post, upvote, downvote] = await Promise.all([this.forum.ACTION_POST.call(), this.forum.ACTION_UPVOTE.call(), await this.forum.ACTION_DOWNVOTE.call()])
            this.actions = { post, upvote, downvote }

            const bn = await this.forum.postCount.call()
            this.lastEpoch = bn.toNumber()-1

            const timestamp = await this.endTimestamp()
            const now = new Date()
            if (timestamp - now > 0) {
                setTimeout(this.getLotteries.bind(this), timestamp - now)
            }

            // Figure out cost for post
            // this.postGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.post, ['0x0', '0x0000000000000000000000000000000000000000000000000000000000000000'])
            // this.voteGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.upvote, ['0x0000000000000000000000000000000000000000000000000000000000000000'])
            // console.log(`postGas ${this.postGas}, voteGas ${this.voteGas}`)

            this.watchForMessages()

            this.signalReady()

        } catch (e) {
            console.error(e)
            throw(e)
        }
    }

    topicOffset(hash) {
        return this.topicOffsets[hash]
    }

    async watchForMessages() {
        await this.ready
        const self = this

        this.forum.Topic({}, {fromBlock: 0}).watch((error, result) => {
            if (error) {
                console.error( error )
                return
            }

            const parentHash  = HashUtils.solidityHashToCid(result.args._parentHash)
            const messageHash = HashUtils.solidityHashToCid(result.args.contentHash)

            console.log(`Topic: ${parentHash} > ${messageHash}`)
            if (parentHash === messageHash) {
                // Probably 0x0 > 0x0 which Solidity adds to make life simple
                self.topicOffsets[messageHash] = self.topicHashes.length
                self.topicHashes.push(messageHash)
                return
            }

            if (typeof self.topicOffsets[messageHash] === 'undefined') {

                let offset = self.topicHashes.length
                console.log(`${messageHash} -> ${offset}`)
                self.topicOffsets[messageHash] = offset
                self.topicHashes.push(messageHash)
                let message = {
                    id: messageHash,
                    parent: parentHash,
                    children: [],
                    offset
                }

                // IMPORTANT - Have to do this first to prevent re-entrancy problems,
                // and only after this any await statements
                this.messages.add(message)

                self.fillMessage(message.id)
            }
        })
    }

    async fillMessage(id) {
        await this.ready;

        let message = this.messages.get(id)
        try {
            await Promise.all([this.updateVotesData(message), this.localStorage.fillMessage(message)])

            // console.log('onModified ',message)
            this.onModifiedMessage(message)

            this.filledMessagesCounter++;

        } catch (e) {
            // Couldn't fill message, throw it away for now
            this.messages.delete(message)

            this.filledMessagesCounter++;

            console.error(e)
            throw (e)
        } finally {
            console.log(this.filledMessagesCounter, ', ', this.lastEpoch)
            if (this.filledMessagesCounter >= this.lastEpoch) {
                this.signalSynced()
            }
        }
    }

    subscribe(parentID, callback) {
        this.callbacks[parentID] = callback
    }

    async updateVotesData(message, delta) {
        if (delta) {
            console.log(`adding to ${message.body} myvotes locally `, delta)
            message.votes += delta
            message.myvotes += delta
        } else {
            const [votes, myvotes] = await Promise.all([this.forum.votes(this.topicOffset(message.id)), this.forum.voters(this.topicOffset(message.id), this.account)])

            message.votes   = votes.toNumber()
            message.myvotes = myvotes.toNumber()
            console.log(`${message.body} ${this.topicOffsets[message.id]} myvotes from sol `, myvotes.toNumber())
        }

        // console.log('updated Votes: ', message)
    }

    onModifiedMessage(message) {

        // Send message back
        let callback = this.callbacks[message.parent]
        if (callback) {
            callback(message)
        }

        this.refreshBalances()
    }

    countReplies(id) {
        return this.messages.get(id).children.length
    }

    refreshBalances() {
        this.refreshTokenBalance()
        this.rewardPool(true)
        this.endTimestamp(true)
    }

    async isOpen() {
        let end = await this.endTimestamp()
        return (new Date().getTime() < end)
    }

    getMessage(id) {
        return this.messages.get(id)
    }

    async getChildrenMessages(id) {
        let self = this
        const message = this.getMessage(id)

        if (!message || message.children.length === 0) {
            return []
        }

        return Promise.all(message.children.map(cid => self.getMessage(cid)).filter(m => m.body))
    }

    async getBalance() {
        await this.ready;
        var balanceWei = await this.token.balanceOf(this.account)
        var balance    = balanceWei.div(10**18).toNumber()
        return balance
    }

    async epoch() {
        await this.ready
        try {
            let r = await this.forum.epochCurrent.call()
            return r.toNumber()
        } catch (e) {
            console.error(e)
            return 0;
        }
    }

    async rewardPool(refresh) {
        await this.ready
        if (!refresh && this.rewardPoolCache) {
            return this.rewardPoolCache
        }
        let reward = await this.forum.nextRewardPool.call()
        this.rewardPoolCache = reward.toNumber() / 10**18
        return this.rewardPoolCache
    }

    async endTimestamp(refresh) {
        if (!refresh && this.endLotteryTimestamp) {
            return this.endLotteryTimestamp
        }

        let time = await this.forum.endTimestamp.call()
        this.endLotteryTimestamp = time.toNumber() * 1000 // Convert to JS
        return this.endLotteryTimestamp
    }

    async rewards() {
        await this.ready
        let promises = [0, 1, 2, 3, 4].map(async i => {
            return this.forum.reward.call(i)
        })

        let rewards = Promise.all(promises)
        return rewards.map(r => r.toString())
    }

    async claim(payoutIndex) {
        await this.ready
        return this.forum.claim(payoutIndex)
    }

    async payoutAccounts() {
        await this.ready
        let promises = [0, 1, 2, 3, 4].map(async i => {
            return this.forum.payouts.call(i)
        })

        let payouts = await Promise.all(promises)
        return payouts.map(p => p.toString())
    }

    async votes(id) {
        await this.ready
        try {
            let r = await this.forum.votes.call(this.topicOffset(id))
            let v = r.toNumber()
            return v
        } catch (e) {
            console.error(e)
            return 0
        }
    }

    async voters(id, user) {
        await this.ready
        try {
            let r = await this.forum.voters.call(this.topicOffset(id), user)
            let v = r.toNumber()
            return v
        } catch (e) {
            console.error(e)
            return 0
        }
    }

    async vote(id, direction) {
        await this.ready

        let action = (direction > 0) ? this.actions.upvote : this.actions.downvote

        let tokenCost = await this.forum.voteCost.call()
        let tx = await this.token.transferAndCall(this.forum.address, tokenCost, action, [this.topicOffset(id).toString()])
        console.log(tx)

        let message = this.messages.get(id)
        await this.updateVotesData(message, direction)
        this.onModifiedMessage(message)
        this.refreshBalances()

        return message
    }

    async winningMessages(offsets) {
        const [from, to] = offsets
        var eligibleMessages = []

        for (let i = from; i < to; i++) {
            eligibleMessages.push(this.getMessage(this.topicHashes[i]))
        }

        // Sort by votes descending, then offset ascending
        const winners = eligibleMessages.sort((a,b) => {
            let diff = b.votes - a.votes
            return (diff === 0) ? a.offset - b.offset : diff
        })

        // Filter out nulls
        return winners.filter(m => m != null && typeof m != 'undefined')
    }

    async winningAuthors(from, to) {
        let winners = await this.winningMessages(from, to)
        return winners.map(m => m.author)
    }

    async priorLottery() {
        await this.synced

        const [epochPriorBN, epochCurrentBN] = await Promise.all([this.forum.epochPrior.call(), this.forum.epochCurrent.call()])
        var    epochPrior   = epochPriorBN.toNumber()
        const epochCurrent = epochCurrentBN.toNumber()
        if ( epochCurrent === epochPrior ) {
            return null
        }
        if ( epochPrior === 0 ) {
            epochPrior++;
        }


        const offsets  = [epochPrior, epochCurrent]
        const winners  = await this.winningAuthors(offsets)
        const rewardBN = await this.forum.rewardPool.call()
        const rewardPool = rewardBN.toNumber()
        const name = "Last"

        return new Lottery( this, name, offsets, winners, rewardPool, true )
    }

    async currentLottery() {
        await this.synced

        const epochCurrentBN = await this.forum.epochCurrent.call()
        var   epochCurrent   = epochCurrentBN.toNumber()
        const epochLatest    = this.topicHashes.length

        if ( epochCurrent === epochLatest ) {
            return null
        }

        if ( epochCurrent === 0 ) {
            epochCurrent++;
        }

        const [rewardBN, endTimeStamp] = await Promise.all([this.token.balanceOf(this.forum.address), this.endTimestamp(true)])

        const now = new Date()
        const offsets  = [epochCurrent, epochLatest]
        const winners = await this.winningAuthors(offsets)
        const rewardPool = rewardBN.toNumber()
        const completed = now.getTime() > endTimeStamp
        const name = "Open"

        return new Lottery( this, name, offsets, winners, rewardPool, completed )
    }

    async getLotteries() {
        await this.synced

        var [priorLottery, currentLottery] = await Promise.all([this.priorLottery(), this.currentLottery()])
        const now = new Date()
        const end = await this.endTimestamp(true)

        console.log('lotteries: ',priorLottery,currentLottery)
        if (end < now.getTime()) {
            currentLottery.name = "Last"

            return {
                priorLottery:   currentLottery,
                currentLottery: null
            }
        }

        return {
            priorLottery,
            currentLottery
        }
    }

    async upvote(id) {
        return this.vote(id, 1)
    }

    async downvote(id) {
        return this.vote(id, -1)
    }

    async createMessage(body, parentHash) {
        await this.ready

        const ipfsMessage = {
            version: '1',
            parent: parentHash || '0x0', // Do we need this since its in Topic?
            author: this.account,
            date: Date.now(),
            body,
        }

        var ipfsHash

        try {
            // Create message and save to it local in-browser IPFS
            ipfsHash = await this.localStorage.createMessage(ipfsMessage)

            // Pin it to ipfs.menlo.one
            await this.remoteStorage.pin(ipfsHash)

            const hashSolidity = HashUtils.cidToSolidityHash(ipfsHash)
            let parentHashSolidity = ipfsMessage.parent
            if (parentHashSolidity !== '0x0') {
                parentHashSolidity = HashUtils.cidToSolidityHash(parentHashSolidity)
            }

            // Send it to Blockchain
            let tokenCost = await this.forum.postCost.call()
            let result = await this.token.transferAndCall(this.forum.address, tokenCost, this.actions.post, [parentHashSolidity, hashSolidity])
            console.log(result)

            return {
                id: ipfsHash,
                ...ipfsMessage
            }
        } catch (e) {
            if (ipfsHash) {
                // Failed - unpin it from ipfs.menlo.one
                this.localStorage.rm(ipfsHash)
                this.remoteStorage.unpin(ipfsHash)
            }

            console.error(e)
            throw e
        }
    }
}

export default ForumService
