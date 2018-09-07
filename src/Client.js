import React from 'react'
import BigNumber from 'bn'
import Blockies from 'react-blockies'

import JavascriptIPFSStorage from './storage/JavascriptIPFSStorage'
import RemoteIPFSStorage from './storage/RemoteIPFSStorage'
import EthereumForum from './contracts/EthereumForum'
import MessageBoardGraph from './storage/MessageBoardGraph'

import web3 from './web3_override'
import TruffleContract from 'truffle-contract'
import tokenContract from 'menlo-token/build/contracts/MenloToken.json'

class FakeClient {

    subscribeMessages(sub) {

    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    getAccountDetails() {
        return new Promise((resolve, reject) => {
            resolve({
                account: '',
                balance: 392833
            })
        })
    }

    topicOffset(hash) {
        return 'complete'
    }

    getLocalMessages(hash) {
        if (!hash) {
            return new Promise((resolve, reject) => {
                resolve([{
                    hash: '1',
                    body: 'Awesome product, awesome team.  I\'d back anything these guys do...',
                    type: 'parent'
                }, {
                    hash: '3',
                    body: 'Many moons ago, we had this idea -- what if we built this but we never did.  I think it would be incredible.',
                    type: 'parent'
                }
                ])
            })
        }

        return new Promise((resolve, reject) => {
            resolve([{
                hash: '2',
                body: 'I agree - have done a lot of business with these guys.',
                type: 'child'
            }])
        })
    }

    countReplies(hash) {
        if (hash === '1') {
            return 1
        }

        return 0
    }

    getVotes(nodeID) {
        return this.getRandomInt(50) - 25
    }
}


class Client {
    constructor() {
        this.tokenContract = TruffleContract(tokenContract)
        this.forum = null;
        this.graph = new MessageBoardGraph()
        this.remoteStorage = new RemoteIPFSStorage('ipfs.menlo.one', '443', {protocol: 'https'}) // new RemoteIPFSStorage('/ip4/127.0.0.1/tcp/5001')
        this.localStorage = new JavascriptIPFSStorage()
        this.localStorage.connectPeer(this.remoteStorage)

        this.votes = {}
        this.epoch = 0
        this.messages = {}
        this.account = null;

        this.getAccountDetails()
    }

    async getAccountDetails() {
        if (!web3) { return {} }

        let self = this
        return new Promise(async (resolve, reject) => {
            web3.eth.getAccounts(async (err, result) => {
                try {
                    self.account = result[0]
                    self.avatar = <Blockies seed={self.account} size={10} ></Blockies>
                    web3.eth.defaultAccount = self.account
                    self.tokenContract.defaults({
                        from: self.account
                    })

                    self.forum = new EthereumForum(self.tokenContract, self.account)
                    await self.tokenContract.setProvider(web3.currentProvider)

                    self.token = await self.tokenContract.deployed()

                    var balanceWei = await this.token.balanceOf(this.account)
                    var balance    = balanceWei.div(10**18)

                    resolve( {
                        account: self.account,
                        avatar: self.avatar,
                        balance
                    })

                    self.epoch = await self.forum.epoch()
                    self.forum.subscribeMessages(self.onNewMessage.bind(this))

                } catch (e) {
                    reject(e);
                }
            })
        })
    }

    async onNewMessage(messageHash, parentHash) {
        let votesCount = await this.forum.votes(this.forum.topicOffset(messageHash))
        this.votes[messageHash] = votesCount
        this.graph.addNode(messageHash, parentHash)
    }

    subscribeMessages(callback) {
        this.graph.subscribeMessages(callback)
    }

    countReplies(nodeID) {
        return this.graph.children(nodeID).length
    }

    async getMessage(nodeID) {
        if (this.messages[nodeID]) {
            return this.messages[nodeID]
        }

        try {
            this.messages[nodeID] = await this.localStorage.findMessage(nodeID)
            return this.messages[nodeID]

        } catch(e) {
            console.log('Error finding message ',e)
        }
    }

    async getLocalMessages(nodeID) {
        const messageIDs = this.graph.children(nodeID || '0x0')

        return Promise.all(messageIDs.map(id => this.getMessage(id)))
    }

    async createMessage(messageBody, parentHash) {
        const message = {
            version: '1.0',
            parent: parentHash || '0x0',
            body: messageBody,
            issuer: this.account,
        }

        try {
            const messageHash = await this.localStorage.createMessage(message)
            await this.forum.post(messageHash, message.parent)
            await this.remoteStorage.pin(messageHash)
        } catch (e) {
            console.error(e);
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

export {FakeClient}

export default Client
