import web3 from './web3_override'
import truffleContract from 'truffle-contract'
import tokenContract from './truffle_artifacts/contracts/AppToken.json'
import MessageBoardError from './MessageBoardError'

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
  constructor(graph, forum, lottery, localStorage, remoteStorage) {
    this.graph = graph
    this.forum = forum
    this.lottery = lottery
    this.localStorage = localStorage
    this.remoteStorage = remoteStorage
    this.token = truffleContract(tokenContract)

    forum.subscribeMessages(this.onNewMessage.bind(this))
    this.votes = {}
    this.epoch = 0
    lottery.epoch().then(e => {
      this.epoch = e
    })
  }

  getAccountDetails() {
    if (!web3) return Promise.reject()

    this.token.setProvider(web3.currentProvider)

    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, result) => {
        const account = result[0]
        if (!account) {
          return reject()
        }

        this.account = account
        this.token.deployed()
          .then(i => i.balanceOf(account))
          .then(balance => resolve({account, balance}))
      })
    })
  }

  onNewMessage(messageHash, parentHash) {
    this.lottery.votes(this.forum.topicOffset(messageHash))
      .then(votesCount => {
        this.votes[messageHash] = votesCount
        this.graph.addNode(messageHash, parentHash)

        console.log(`${messageHash} has ${votesCount} votes`)
      })
  }

  subscribeMessages(callback) {
    this.graph.subscribeMessages(callback)
  }

  countReplies(nodeID) {
    return this.graph.children(nodeID).length
  }

  getLocalMessages(nodeID) {
    const messageIDs = this.graph.children(nodeID || '0x0')

    return Promise.all(messageIDs.map(id => this.localStorage.findMessage(id)))
      .then(messages => messages.filter(m => {
        console.log('Found message ', m)
        return m
      }))
  }

  async createMessage(messageBody, parentHash) {
    const message = {
      version: 'CONTRACT_VERSION',
      parent: parentHash || '0x0',
      body: messageBody,
      issuer: this.account,
    }

    const messageHash = await this.localStorage.createMessage(message)
      .catch(() => {
        Promise.reject(new MessageBoardError('An error occurred saving the message to local IPFS.'))
      })

    await this.remoteStorage.pin(messageHash)
      .catch(() => {
        Promise.reject(new MessageBoardError('An error occurred pinning the message to IPFS.'))
      })

    return this.forum.post(messageHash, message.parent)
      .catch(() => {
        Promise.reject(new MessageBoardError('An error occurred verifying the message.'))
      })
  }

  topicOffset(messageHash) {
    return this.forum.topicOffset(messageHash)
  }

  getVotes(messageHash) {
    return this.votes[messageHash] || 0
  }

  upvote(messageHash) {
    return this.lottery.upvote(this.topicOffset(messageHash))
  }

  downvote(messageHash) {
    return this.lottery.downvote(this.topicOffset(messageHash))
  }

  getPayoutAccounts() {
    return this.lottery.payoutAccounts()
  }

  claim(payoutIndex) {
    return this.lottery.claim(payoutIndex)
  }

  getRewards() {
    return this.lottery.rewards()
  }
}

export {FakeClient}

export default Client
