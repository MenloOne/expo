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

import web3 from '../web3_override'
import TruffleContract from 'truffle-contract'
import ForumContract from '../truffle_artifacts/contracts/Forum.json'

import HashUtils from '../HashUtils'


class EthereumForum {

    constructor(_tokenContract, account) {
        this.topicOffsetCounter = 0
        this.topicOffsets = {}
        this.account = account

        this.tokenContract = _tokenContract
        this.forumContract = TruffleContract(ForumContract)
        this.forumContract.defaults({
            from: this.account
        })

        this.forum = null;
        this.getContracts();
    }

    async getContracts() {
        if (web3) {
            this.forumContract.setProvider(web3.currentProvider)
            this.tokenContract.setProvider(web3.currentProvider)
        }

        this.token = await this.tokenContract.deployed()
        this.forum = await this.forumContract.deployed()

        this.actions = {
            post: await this.forum.ACTION_POST.call()
        }
    }

    async subscribeMessages(callback) {
        if (!this.forum) {
            await this.getContracts();

            if (!this.forum) {
                return
            }
        }

        try {
            this.forum.Topic({}, {fromBlock: 0}).watch((error, result) => {
                const parentHash = HashUtils.solidityHashToCid(result.args._parentHash)
                const messageHash = HashUtils.solidityHashToCid(result.args.contentHash)

                if (!this.topicOffsets[messageHash]) { // sometimes we get the same topic twice...
                    this.topicOffsets[messageHash] = this.topicOffsetCounter
                    this.topicOffsetCounter = this.topicOffsetCounter + 1

                    console.log(`Found message ${parentHash} > ${messageHash}`)

                    callback(messageHash, parentHash)
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

    topicOffset(hash) {
        return this.topicOffsets[hash]
    }


    async epoch() {
        if (!this.forum) {
            await this.getContracts();

            if (!this.forum) {
                return
            }
        }

        try {
            let r = await this.forum.epochCurrent.call()
            return r.toNumber()
        } catch (e) {
            console.error(e)
            return 0;
        }
    }

    async votes(offset) {
        if (!this.forum) {
            return
        }

        try {
            let r = await this.forum.votes.call(offset)
            return parseInt(r.toString(), 0)
        } catch (e) {
            console.error(e)
        }
    }

    async upvote(offset) {
        if (!this.forum) {
            return
        }

        return this.forum.upvote(offset, {from: this.account})
    }

    async downvote(offset) {
        if (!this.forum) {
            return
        }

        return this.forum.downvote(offset, {from: this.account})
    }

    async payoutAccounts() {
        if (!this.forum) {
            return
        }

        let promises = [0, 1, 2, 3, 4].map(async i => {
            let r = await this.forum.payouts.call(i)
            return r.toString()
        })

        return Promise.all(promises)
    }

    async rewards() {
        if (!this.forum) {
            return
        }

        let promises = [0, 1, 2, 3, 4].map(async i => {
            let r = await this.forum.reward.call(i)
            return r.toString()
        })

        return Promise.all(promises)
    }

    async claim(payoutIndex) {
        if (!this.forum) {
            return
        }
        return this.forum.claim(payoutIndex, {from: this.account})
    }

    async post(hash, parentHash) {
        if (!this.token) {
            return
        }

        hash = HashUtils.cidToSolidityHash(hash)
        if (parentHash !== '0x0') {
            parentHash = HashUtils.cidToSolidityHash(parentHash)
        }

        try {
            let tokenCost = await this.forum.postCost.call()
            let result = await this.token.transferAndCall(this.forum.address, tokenCost, this.actions.post, [parentHash, hash])
            console.log(result)
        } catch(e) {
            console.error(e);
        }
    }

}

export default EthereumForum
