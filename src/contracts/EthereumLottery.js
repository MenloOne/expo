/*
 *
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import web3 from 'web3_override'
import TruffleContract from 'truffle-contract'
import LotteryContract from 'truffle_artifacts/contracts/Lottery.json'

class EthereumLottery {

  epoch = () => {
    if (!this.lottery) {
      return
    }

    return this.lottery.deployed()
      .then(l => l.epochCurrent.call())
      .then(r => parseInt(r.toString(), 0))
      .catch(e => {
      })
  }
  votes = (offset) => {
    if (!this.lottery) {
      return
    }

    return this.lottery.deployed()
      .then(i => i.votes.call(offset))
      .then(r => parseInt(r.toString(), 0))
      .catch(e => {
      })
  }
  upvote = async (offset) => {
    if (!this.lottery) {
      return
    }

    return web3.eth.getAccounts().then(async (accounts) => {
      let account = accounts[0]

      return this.lottery.deployed()
        .then(i => i.upvote(offset, {from: account}))
        .catch(e => {
        })
    })
  }
  downvote = async (offset) => {
    if (!this.lottery) {
      return
    }

    return web3.eth.getAccounts().then(async (accounts) => {
      let account = accounts[0]

      return this.lottery.deployed()
        .then(i => i.downvote(offset, {from: account}))
    })
  }
  payoutAccounts = async () => {
    if (!this.lottery) {
      return
    }

    let promises = [0, 1, 2, 3, 4].map(i =>
      this.lottery.deployed()
        .then(l => l.payouts.call(i))
        .then(r => r.toString())
        .catch(e => {
        })
    )

    return Promise.all(promises)
  }
  rewards = async () => {
    if (!this.lottery) {
      return
    }

    let promises = [0, 1, 2, 3, 4].map(i =>
      this.lottery.deployed()
        .then(l => l.reward.call(i))
        .then(r => r.toString())
        .catch(e => {
        })
    )

    return Promise.all(promises)
  }
  claim = async (payoutIndex) => {
    if (!this.lottery) {
      return
    }

    return web3.eth.getAccounts().then(async (accounts) => {
      let account = accounts[0]
      console.log(account)

      return this.lottery.deployed()
        .then(i => i.claim(payoutIndex, {from: account}))
    })
  }

  constructor() {
    this.lottery = TruffleContract(LotteryContract)
    this.refresh()
  }

  refresh() {
    if (web3) {
      this.lottery.setProvider(web3.currentProvider)
    }
  }
}

export default EthereumLottery
