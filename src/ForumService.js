import web3 from './web3_override'
import TruffleContract from 'truffle-contract'
import TokenContract from 'menlo-token/build/contracts/MenloToken.json'
import ForumContract from './truffle_artifacts/contracts/Forum.json'

import JavascriptIPFSStorage from './storage/JavascriptIPFSStorage'
import RemoteIPFSStorage from './storage/RemoteIPFSStorage'
import MessagesGraph from './storage/MessageBoardGraph'

import HashUtils from './HashUtils'


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

        this.ready = new Promise((resolve) => { this.signalReady = resolve })
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

            this.topicOffsetCounter = 0
            this.topicOffsets = {}

            await this.forumContract.setProvider(web3.currentProvider)
            this.forumContract.defaults({
                from: this.account
            })
            this.forum = await this.forumContract.deployed();

            this.actions = {
                post:     await this.forum.ACTION_POST.call(),
                upvote:   await this.forum.ACTION_UPVOTE.call(),
                downvote: await this.forum.ACTION_DOWNVOTE.call(),
            }

            // Figure out cost for post
            // this.postGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.post, ['0x0', '0x0000000000000000000000000000000000000000000000000000000000000000'])
            // this.voteGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.upvote, ['0x0000000000000000000000000000000000000000000000000000000000000000'])
            // console.log(`postGas ${this.postGas}, voteGas ${this.voteGas}`)

            this.watchForMessages()

            this.signalReady()

        } catch (e) {
            console.error(e);
        }
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

            if (parentHash === messageHash) {
                // Probably 0x0 > 0x0 which Solidity adds to make life simple
                self.topicOffsetCounter = self.topicOffsetCounter + 1
                return
            }

            if (typeof self.topicOffsets[messageHash] === 'undefined') {
                console.log(`Topic: ${parentHash} > ${messageHash}`)

                self.topicOffsets[messageHash] = self.topicOffsetCounter
                self.topicOffsetCounter = self.topicOffsetCounter + 1

                self.onNewMessage({
                    id: messageHash,
                    parent: parentHash
                })
            }
        })
    }

    topicOffset(hash) {
        return this.topicOffsets[hash]
    }

    subscribe(parentID, callback) {
        this.callbacks[parentID] = callback
    }

    async onNewMessage(metadata) {
        await this.ready;

        // Prevent re-entrancy - we must finish with messages.add() before checking to see if its been done before
        while ( this.newMessageOnging ) {
            await this.newMessageOnging
        }

        let resolveNewMessageOngoing
        this.newMessageOnging = new Promise((resolve) => { resolveNewMessageOngoing = resolve })

        if (typeof this.messages.get(metadata.id) !== 'undefined') {
            // Already added
            this.newMessageOnging = null
            resolveNewMessageOngoing()
            return
        }

        try {
            let offset = this.topicOffset(metadata.id)
            let ifpsMessage = await this.localStorage.findMessage(metadata.id)

            let message = {
                id: metadata.id,
                parent: metadata.parent,
                children: [],
                date: metadata.date,
                offset: offset,
                ...ifpsMessage
            }
            await this.updateVotesData(message)
            this.messages.add(message)

            this.onModifiedMessage(message)

            this.newMessageOnging = null
            resolveNewMessageOngoing()
        } catch (e) {
            console.error(e)

            this.newMessageOnging = null
            resolveNewMessageOngoing()
            throw (e)
        }
    }

    async updateVotesData(message, delta) {
        if (delta) {
            message.votes += delta
            message.myvotes += delta
        } else {
            let votes   = await this.forum.votes(this.topicOffset(message.id))
            let myvotes = await this.forum.voters(this.topicOffset(message.id), this.account)

            message.votes   = votes.toNumber()
            message.myvotes = myvotes.toNumber()
        }

        console.log('updated Votes: ', message)
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

    getMessage(id) {
        return this.messages.get(id)
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

    async getChildrenMessages(id) {
        let self = this
        const message = this.getMessage(id)

        if (!message || message.children.length === 0) {
            return []
        }

        return Promise.all(message.children.map(cid => self.getMessage(cid)))
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
        await this.ready
        if (!refresh && this.endTimeStampCache) {
            return this.endTimeStampCache
        }

        let time = await this.forum.endTimestamp.call()
        this.endTimestampCache = time.toNumber() * 1000 // Convert to JS
        return this.endTimestampCache
    }

    async rewards() {
        await this.ready
        let promises = [0, 1, 2, 3, 4].map(async i => {
            let r = await this.forum.reward.call(i)
            return r.toString()
        })

        return await Promise.all(promises)
    }

    async claim(payoutIndex) {
        await this.ready
        return this.forum.claim(payoutIndex)
    }

    async payoutAccounts() {
        await this.ready
        let promises = [0, 1, 2, 3, 4].map(async i => {
            let r = await this.forum.payouts.call(i)
            return r.toString()
        })

        return Promise.all(promises)
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

        try {
            const ipfsHash = await this.localStorage.createMessage(ipfsMessage)

            const hashSolidity = HashUtils.cidToSolidityHash(ipfsHash)
            let parentHashSolidity = ipfsMessage.parent
            if (parentHashSolidity !== '0x0') {
                parentHashSolidity = HashUtils.cidToSolidityHash(parentHashSolidity)
            }

            let tokenCost = await this.forum.postCost.call()
            let result = await this.token.transferAndCall(this.forum.address, tokenCost, this.actions.post, [parentHashSolidity, hashSolidity])
            console.log(result)

            await this.remoteStorage.pin(ipfsHash)

            return {
                id: ipfsHash,
                ...ipfsMessage
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export default ForumService
