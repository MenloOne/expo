import web3 from '../web3_override'
import TruffleContract from 'truffle-contract'
import TokenContract from 'menlo-token/build/contracts/MenloToken.json'

import ForumContract from '../truffle_artifacts/contracts/Forum.json'

import JavascriptIPFSStorage from '../storage/JavascriptIPFSStorage'
import RemoteIPFSStorage from '../storage/RemoteIPFSStorage'
import MessagesGraph from '../storage/MessageBoardGraph'

import HashUtils from '../HashUtils'


class Message {

    constructor(forum, id, parent, offset) {
        this.forum = forum
        this.id = id
        this.parent = parent
        this.offset = offset
        this.children = []
    }

    votesDisabled() {
        return (this.author === this.forum.account || this.forum.currentLottery.offsets[0] > this.offset)
    }

    upvoteDisabled() {
        return (this.votesDisabled() || this.myvotes > 0)
    }

    downvoteDisabled() {
        return (this.votesDisabled() || this.myvotes < 0)
    }
}


class Lottery {

    DEBUG = true

    constructor( _forum, _type ) {
        this.forum = _forum
        this.type = _type
        this.claimed = false
        this.offsets = [0,0]

        this.refresh()
    }

    async refresh() {
        await this.forum.synced

        if (this.type == 'current') {
            const epochLatest    = Math.max(this.forum.topicHashes.length, 1)
            const epochCurrentBN = await this.forum.forum.epochCurrent.call()
            var   epochCurrent   = Math.max(epochCurrentBN.toNumber(), 1)
            this.offsets = [epochCurrent, epochLatest]

            const [poolBN] = await Promise.all([this.forum.forum.nextRewardPool.call()])
            this.pool = poolBN.toNumber() / 10 ** 18

            var bn = await this.forum.forum.currentLottery.call()
            this.lotteryID = bn.toNumber()

        } else {

            const [epochPriorBN, epochCurrentBN] = await Promise.all([this.forum.forum.epochPrior.call(), this.forum.forum.epochCurrent.call()])
            var   epochPrior   = Math.max(epochPriorBN.toNumber(), 1)
            const epochCurrent = Math.max(epochCurrentBN.toNumber(), 1)
            this.offsets  = [epochPrior, epochCurrent]

            const poolBN = await this.forum.forum.rewardPool.call()
            this.pool = poolBN.toNumber() / 10**18

            var bn = await this.forum.forum.currentLottery.call()
            this.lotteryID = bn.toNumber()-1
        }

        this.claimed = this.forum.claimedLotteries[this.lotteryID]
        this.winners = await this.forum.winningAuthors(this.offsets)
        this.iWon = (this.hasEnded() && this.winners.filter(a => a === this.forum.account).length > 0)

        if (this.iWon) {
            // Check if server has already payed out
            // TODO: Do this through event watch and lottery numbers...
        }

        if (this.DEBUG) {
            const forum = this.forum.forum // SOL Contract

            const debug = {}

            const [p,c,r,v,pc] = await Promise.all([
                forum.epochPrior.call(),
                forum.epochCurrent.call(),
                forum.rewardPool.call(),
                forum.votesCount.call(),
                forum.postCount.call()])

            Object.assign(debug, {
                epochPrior: p.toNumber(),
                epochCurrent: c.toNumber(),
                rewardPool: r.toNumber(),
                votesCount: v.toNumber(),
                postersCount: pc.toNumber(),
                show: this.show(),
                ended: this.hasEnded(),
                currentType: this.currentType()
            })

            debug.votes = []
            for (let i = 0; i < debug.votesCount; i++) {
                const bn = await forum.votes.call(i)
                debug.votes.push(bn.toNumber())
            }

            debug.payouts = []
            for (let i = 0; i < 5; i++) {
                debug.payouts.push(await forum.payouts.call(i))
            }

            debug.posters = []
            for (let i = 0; i < debug.postersCount; i++) {
                debug.posters.push(await forum.posters.call(i))
            }

            debug.voters = []
            for (let i = 0; i < debug.postersCount; i++) {
                debug.voters.push (await Promise.all(this.winners.map(async (user) => {
                    let bn = await forum.voters.call(i, user)
                    return { user, votes: bn.toNumber() }
                })))
            }

            this.debug = debug
        }

        return this
    }

    currentType() {
        if (this.type == 'last') return 'last'

        return (this.offsets[1] == this.forum.topicHashes.length && !this.forum.currentLotteryElapsed()) ? 'current' : 'last'
    }

    show() {
        return ((this.type === 'current') ||
                (this.type === 'last' && this.offsets[1] != 1 && !this.forum.currentLotteryElapsed()))
    }

    hasEnded() {
        if (this.currentType() === 'last' || this.offsets[1] < this.forum.topicHashes.length-1) {
            return true
        }

        return this.forum.currentLotteryElapsed()
    }

    name() {
        return this.hasEnded() ? 'Last' : 'Open'
    }

    totalWinners() {
        return this.winners.length
    }

    winnings(i) {
        const r = this.pool
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

        return (me + rest / this.totalWinners())
    }

    totalWinnings() {
        let totals = this.winners.map((a, i) => {
            if (a === this.forum.account) {
                return this.winnings(i)
            }
            return 0
        })

        return totals.reduce((acc, cur) => acc + cur)
    }

    async claimWinnings() {
        await this.forum.forum.claim()

        // How long do we wait?
        setTimeout(this.forum.refreshBalances.bind(this.forum), 2000)
    }
}



class ForumService {


    constructor() {
        this.ready  = new Promise((resolve) => { this.signalReady = resolve })
        this.synced = new Promise((resolve) => { this.signalSynced = resolve })

        this.tokenContract = TruffleContract(TokenContract)
        this.forumContract = TruffleContract(ForumContract)

        this.forum = null;
        this.remoteStorage = new RemoteIPFSStorage('ipfs.menlo.one', '443', {protocol: 'https'}) // new RemoteIPFSStorage('/ip4/127.0.0.1/tcp/5001')
        this.localStorage = new JavascriptIPFSStorage()
        this.localStorage.connectPeer(this.remoteStorage)

        this.messages = new MessagesGraph()
        this.epoch = 0
        this.account = null;
        this.messagesCallbacks = {}
        this.lotteriesCallback = null
        this.newMessageOnging = null

        this.claimedLotteries = {}
        this.priorLottery   = new Lottery(this, 'last')
        this.currentLottery = new Lottery(this, 'current')
    }

    async setAccount(acct) {
        if (acct.account === this.account) {
            return
        }

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

            var bn = await this.forum.postCount.call()
            this.lastEpoch = bn.toNumber()-1
            await this.refreshEndLotteryTime()
            bn = await this.forum.epochLength.call()
            this.lotteryLength = bn.toNumber() * 1000

            // Figure out cost for post
            // this.postGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.post, ['0x0', '0x0000000000000000000000000000000000000000000000000000000000000000'])
            // this.voteGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.upvote, ['0x0000000000000000000000000000000000000000000000000000000000000000'])
            // console.log(`postGas ${this.postGas}, voteGas ${this.voteGas}`)

            this.watchForPayouts()
            this.watchForMessages()
            this.watchForVotes()

            this.signalReady()

            if (this.lastEpoch === 0) {
                this.signalSynced()
            }

        } catch (e) {
            console.error(e)
            throw(e)
        }
    }

    currentLotteryElapsed() {
        const now = new Date()
        return (now.getTime() > this.endLotteryTime &&  this.currentLottery.winners && this.currentLottery.winners.length > 0)

    }

    topicOffset(hash) {
        return this.topicOffsets[hash]
    }

    async watchForPayouts() {
        await this.synced
        const self = this

        this.forum.Payout({}, {fromBlock: 0}).watch((error, result) => {
            if (error) {
                console.error( error )
                return
            }

            const payout = {
                lottery: result.args._lottery.toNumber(),
                tokens:  result.args._tokens.toNumber(),
                user:    result.args._user
            }
            console.log('Payout: ', payout)

            if (payout.user.toLowerCase() === self.account) {
                // Mark payout
                self.claimedLotteries[payout.lottery] = true
                if (self.priorLottery.lotteryID === payout.lottery) {
                    self.refreshLotteries()
                }
            }
        })
    }

    async watchForVotes() {
        this.forum.Vote({}, {fromBlock: 0}).watch((error, result) => {
            if (error) {
                console.error( error )
                return
            }

            const offset  = result.args._offset
            const message = this.topicHashes[offset]
            if (message) {
                this.updateVotesData(message)
                this.onModifiedMessage(message)

                if (offset >= this.currentLottery.offset[0]) {
                    this.refreshLotteries(true)
                }
            }
        })
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
                let message = new Message( this, messageHash, parentHash, offset )

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
            if (this.filledMessagesCounter >= this.lastEpoch) {
                this.signalSynced()
            }
        }
    }

    subscribeMessages(parentID, callback) {
        this.messagesCallbacks[parentID] = callback
    }

    subscribeLotteries(callback) {
        this.lotteriesCallback = callback
    }

    async updateVotesData(message, delta) {
        if (delta) {
            message.votes += delta
            message.myvotes += delta
        } else {
            const [votes, myvotes] = await Promise.all([this.forum.votes(this.topicOffset(message.id)), this.forum.voters(this.topicOffset(message.id), this.account)])

            message.votes   = votes.toNumber()
            message.myvotes = myvotes.toNumber()
        }

        // console.log('updated Votes: ', message)
    }

    onModifiedMessage(message) {

        // Send message back
        let callback = this.messagesCallbacks[message.parent]
        if (callback) {
            callback(message)
        }

        this.refreshBalances()
    }

    countReplies(id) {
        return this.messages.get(id).children.length
    }

    async refreshBalances() {
        await Promise.all([
            this.refreshTokenBalance(),
            this.refreshRewardPool(true),
            this.refreshEndLotteryTime(true),
        ])

        if (this.lotteriesCallback) {
            this.lotteriesCallback()
        }
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

    async refreshRewardPool(refresh) {
        await this.ready
        if (!refresh && this.rewardPool) {
            return this.rewardPool
        }

        let reward = await this.forum.nextRewardPool.call()
        this.rewardPool = reward.toNumber() / 10**18

        return this.rewardPool
    }

    async refreshEndLotteryTime() {
        let timeBN = await this.forum.endTimestamp.call()
        this.endLotteryTime = timeBN.toNumber() * 1000 // Convert to JS

        var now = new Date()
        if (this.endLotteryTime < now.getTime() && !this.currentLotteryElapsed()) {
            // We're in a weird state where the server will continue the current lottery
            // as soon as someone pays up.  Assume more time
            this.endLotteryTime = new Date(now.getTime() + this.lotteryLength)
        }

        if (this.lotteryTimeout) {
            clearTimeout(this.lotteryTimeout)
            this.lotteryTimeout = null
        }

        if (now.getTime() < this.endLotteryTime) {
            this.lotteryTimeout = setTimeout(this.refreshLotteries.bind(this), this.endLotteryTime - now.getTime())
        }

        return this.endLotteryTime
    }

    async rewards() {
        await this.ready
        let promises = [0, 1, 2, 3, 4].map(async i => {
            return this.forum.reward.call(i)
        })

        let rewards = Promise.all(promises)
        return rewards.map(r => r.toString())
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

        let message = this.messages.get(id)
        await this.updateVotesData(message, direction)
        this.onModifiedMessage(message)
        this.refreshBalances()

        return message
    }

    async winningMessages(offsets) {
        const [from, to] = offsets

        if (to <= from) {
            return []
        }

        var eligibleMessages = []

        for (let i = from; i < to; i++) {
            eligibleMessages.push(this.getMessage(this.topicHashes[i]))
        }

        // Sort by votes descending, then offset ascending
        const winners = eligibleMessages.sort((a,b) => {
            let diff = b.votes - a.votes
            return (diff === 0) ? a.offset - b.offset : diff
        }).slice(0,5)

        // Filter out nulls
        return winners.filter(m => m != null && typeof m != 'undefined')
    }

    async winningAuthors(from, to) {
        let winners = await this.winningMessages(from, to)
        return winners.map(m => m.author)
    }


    async refreshLotteries(refresh) {
        await this.synced

        await Promise.all([this.priorLottery.refresh(), this.currentLottery.refresh()])

        return {
            currentLottery: this.currentLottery,
            priorLottery:   this.priorLottery,
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
