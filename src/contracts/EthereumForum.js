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

        this.tokenContract = _tokenContract
        this.forumContract = TruffleContract(ForumContract)
        this.forumContract.defaults({
            from: this.account
        })
        this.forum = null;

        this.ready = this.setupAccount(account)
    }

    topicOffset(hash) {
        return this.topicOffsets[hash]
    }

    async setupAccount(account) {
        this.account = account

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
        await this.ready

        this.forum.Topic({}, {fromBlock: 0}).watch((error, result) => {
            if (error) {
                console.error( error )
                return
            }

            const parentHash = HashUtils.solidityHashToCid(result.args._parentHash)
            const messageHash = HashUtils.solidityHashToCid(result.args.contentHash)

            console.log(`Topic: ${parentHash} > ${messageHash}`)

            // sometimes we get the same topic twice...
            if (!this.topicOffsets[messageHash]) {

                this.topicOffsets[messageHash] = this.topicOffsetCounter
                this.topicOffsetCounter = this.topicOffsetCounter + 1

                console.log('Need to send back date from ', result)

                callback({
                        id: messageHash,
                        parent: parentHash,
                        date: 0,
                    })
            }
        })
    }

    /*
     * Forum contracts - should get replaced by Typescript shim
     */

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

    async votes(offset) {
        await this.ready
        try {
            let r = await this.forum.votes.call(offset)
            return parseInt(r.toString(), 0)
        } catch (e) {
            console.error(e)
        }
    }

    async upvote(offset) {
        await this.ready
        return this.forum.upvote(offset, {from: this.account})
    }

    async downvote(offset) {
        await this.ready
        return this.forum.downvote(offset, {from: this.account})
    }

    async payoutAccounts() {
        await this.ready
        let promises = [0, 1, 2, 3, 4].map(async i => {
            let r = await this.forum.payouts.call(i)
            return r.toString()
        })

        return Promise.all(promises)
    }

    async rewards() {
        await this.ready
        let promises = [0, 1, 2, 3, 4].map(async i => {
            let r = await this.forum.reward.call(i)
            return r.toString()
        })

        return Promise.all(promises)
    }

    async claim(payoutIndex) {
        await this.ready
        return this.forum.claim(payoutIndex, {from: this.account})
    }

    async post(hash, parentHash) {
        await this.ready

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
