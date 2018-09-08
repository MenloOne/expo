import React from 'react'
import BigNumber from 'bn'
import Blockies from 'react-blockies'

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
        this.callback = null
        this.account = null;
        this.callbacks = {}

        this.getAccountDetails()
    }

    async getAccountDetails() {
        if (!web3) { return {} }

        try {
            const accounts = await web3.eth.getAccounts()
            this.account = accounts[0]
            this.avatar = <Blockies seed={this.account} size={10} />
            web3.eth.defaultAccount = this.account
            await this.tokenContract.setProvider(web3.currentProvider)
            this.tokenContract.defaults({
                from: this.account
            })
            this.token = await this.tokenContract.deployed()
            this.forum = new EthereumForum(this.tokenContract, this.account)

            var balanceWei = await this.token.balanceOf(this.account)
            var balance    = balanceWei.div(10**18)

            this.epoch = await this.forum.epoch()
            this.forum.subscribeMessages(this.onNewMessage.bind(this))

            return {
                account: this.account,
                avatar: this.avatar,
                balance
            }

        } catch (e) {
            console.error(e);
        }
    }

    subscribe(parentID, callback) {
        this.callbacks[parentID] = callback
    }

    async onNewMessage(metadata) {
        if (this.messages.get(metadata.id)) {
            // Already added
            return
        }

        let offset = this.forum.topicOffset(metadata.id)
        let votes = await this.forum.votes(offset)
        let ifpsMessage = await this.localStorage.findMessage(metadata.id)

        let message = {
            id: metadata.id,
            parent: metadata.parent,
            children: [],
            date: metadata.date,
            votes,
            offset: offset,
            ...ifpsMessage
        }

        this.messages.add(message)

        let callback = this.callbacks[metadata.parent]
        if (callback) {
            callback(message)
        }
    }

    countReplies(nodeID) {
        return this.messages.get(nodeID).children.length
    }

    getMessage(nodeID) {
        this.messages.get(nodeID)
    }

    async getChildrenMessages(nodeID) {
        let self = this
        let message = this.messages.get(nodeID)
        return Promise.all(message.children.map(id => self.messages.get(id)))
    }

    async createMessage(body, parentHash) {
        const ipfsMessage = {
            version: '1',
            author: this.account,
            parent: parentHash || '0x0', // Do we need this since its in Topic?
            body,
        }

        try {
            const messageHash = await this.localStorage.createMessage(ipfsMessage)
            await this.forum.post(messageHash, ipfsMessage.parent)
            await this.remoteStorage.pin(messageHash)

            return {
                id: messageHash,
                ...ipfsMessage
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    topicOffset(messageHash) {
        return this.forum.topicOffset(messageHash)
    }

    getVotes(messageHash) {
        return this.votes[messageHash] || 0
    }

    upvote(messageHash) {
        return this.forum.upvote(this.topicOffset(messageHash))
    }

    downvote(messageHash) {
        return this.forum.downvote(this.topicOffset(messageHash))
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
