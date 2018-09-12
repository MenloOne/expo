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
            post:   await this.forum.ACTION_POST.call(),
            upvote: await this.forum.ACTION_UPVOTE.call(),
            downvote: await this.forum.ACTION_DOWNVOTE.call(),
        }

        // Figure out cost for post
        // this.postGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.post, ['0x0', '0x0000000000000000000000000000000000000000000000000000000000000000'])
        // this.voteGas = await this.token.transferAndCall.estimateGas(this.forum.address, 1 * 10**18, this.actions.upvote, ['0x0000000000000000000000000000000000000000000000000000000000000000'])
        // console.log(`postGas ${this.postGas}, voteGas ${this.voteGas}`)
    }

    async subscribeMessages(callback) {
        await this.ready

        if (this.callback) {
            this.callback = callback
            return
        }
        this.callback = callback

        const self = this

        this.forum.Topic({}, {fromBlock: 0}).watch((error, result) => {
            if (error) {
                console.error( error )
                return
            }

            const parentHash  = HashUtils.solidityHashToCid(result.args._parentHash)
            const messageHash = HashUtils.solidityHashToCid(result.args.contentHash)

            // sometimes we get the same topic twice...
            if (typeof self.topicOffsets[messageHash] == 'undefined') {

                console.log(`Topic: ${parentHash} > ${messageHash}`)

                self.topicOffsets[messageHash] = self.topicOffsetCounter
                self.topicOffsetCounter = self.topicOffsetCounter + 1

                self.callback({
                        id: messageHash,
                        parent: parentHash
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

    async upvote(id) {
        await this.ready
        let hash = HashUtils.cidToSolidityHash(id)
        let tokenCost = await this.forum.voteCost.call()
        let tx = await this.token.transferAndCall(this.forum.address, tokenCost, this.actions.upvote, [this.topicOffset(id).toString()])
        console.log(tx)
    }

    async downvote(id) {
        await this.ready
        let hash = HashUtils.cidToSolidityHash(id)
        let tokenCost = await this.forum.voteCost.call()
        let tx = await this.token.transferAndCall(this.forum.address, tokenCost, this.actions.downvote, [this.topicOffset(id).toString()])
        console.log(tx)
    }

    async post(_hash, _parentHash) {
        await this.ready

        let hash = HashUtils.cidToSolidityHash(_hash)
        let parentHash = _parentHash
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
