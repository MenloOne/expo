import JavascriptIPFSStorage from './storage/JavascriptIPFSStorage'
import RemoteIPFSStorage from './storage/RemoteIPFSStorage'
import EthereumForum from './contracts/EthereumForum'
import MessagesGraph from './storage/MessageBoardGraph'

import web3 from './web3_override'
import TruffleContract from 'truffle-contract'
import tokenContract from 'menlo-token/build/contracts/MenloToken.json'


class Client {

    constructor() {
        this.tokenContract = TruffleContract(tokenContract)
        this.forum = null;
        this.remoteStorage = new RemoteIPFSStorage('ipfs.menlo.one', '443', {protocol: 'https'}) // new RemoteIPFSStorage('/ip4/127.0.0.1/tcp/5001')
        this.localStorage = new JavascriptIPFSStorage()
        this.localStorage.connectPeer(this.remoteStorage)

        this.messages = new MessagesGraph()
        this.epoch = 0
        this.account = null;
        this.callbacks = {}
        this.newMessageOnging = null
    }

    async setAccount(acct) {
        try {
            this.account = acct.account
            this.refreshBalance = acct.refreshBalance

            await this.tokenContract.setProvider(web3.currentProvider)
            this.tokenContract.defaults({
                from: this.account
            })
            this.token = await this.tokenContract.deployed()
            this.forum = new EthereumForum(this.tokenContract, this.account)

            this.epoch = await this.forum.epoch()
            this.forum.subscribeMessages(this.onNewMessage.bind(this))

        } catch (e) {
            console.error(e);
        }
    }

    async getBalance() {
        var balanceWei = await this.token.balanceOf(this.account)
        var balance    = balanceWei.div(10**18).toNumber()
        return balance
    }

    subscribe(parentID, callback) {
        this.callbacks[parentID] = callback
    }

    async onNewMessage(metadata) {
        let self = this

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

            let offset = this.forum.topicOffset(metadata.id)
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
            message.votes   = await this.forum.votes(message.id)
            message.myvotes = await this.forum.voters(message.id, this.account)
        }

        console.log('updated Votes: ', message)
    }

    onModifiedMessage(message) {
        // Send message back
        let callback = this.callbacks[message.parent]
        if (callback) {
            callback(message)
        }
    }

    countReplies(id) {
        return this.messages.get(id).children.length
    }

    getMessage(id) {
        return this.messages.get(id)
    }

    async getChildrenMessages(id) {
        let self = this
        const message = this.getMessage(id)

        if (!message || message.children.length == 0) {
            return []
        }

        return Promise.all(message.children.map(cid => self.getMessage(cid)))
    }

    async createMessage(body, parentHash) {
        const ipfsMessage = {
            version: '1',
            parent: parentHash || '0x0', // Do we need this since its in Topic?
            author: this.account,
            date: Date.now(),
            body,
        }

        try {
            const messageHash = await this.localStorage.createMessage(ipfsMessage)

            await this.forum.post(messageHash, ipfsMessage.parent)
            await this.remoteStorage.pin(messageHash)

            this.refreshBalance()

            return {
                id: messageHash,
                ...ipfsMessage
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    async upvote(id) {
        await this.forum.upvote(id)
        let message = this.messages.get(id)
        await this.updateVotesData(message, 1)
        this.onModifiedMessage(message)
        this.refreshBalance()
        return message
    }

    async downvote(id) {
        await this.forum.downvote(id)
        let message = this.messages.get(id)
        await this.updateVotesData(message, -1)
        this.onModifiedMessage(message)
        this.refreshBalance()
        return message
    }

    topicOffset(messageHash) {
        return this.forum.topicOffset(messageHash)
    }

    getPayoutAccounts() {
        return this.forum.payoutAccounts()
    }

    claim(payoutIndex) {
        return this.forum.claim(payoutIndex)
    }

    getRewards() {
        return this.forum.rewards()
    }
}

export default Client
