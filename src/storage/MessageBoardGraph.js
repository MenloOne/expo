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


class MessageGraph {

    constructor(rootMessage) {
        if (!rootMessage) {
            rootMessage = {
                id: '0x0',
                children: []
            }
        }

        this.messages = {}
        this.add(rootMessage)
    }

    add(message) {
        let parentID = message.parent || '0x0'

        let parentHash = message.parent
        console.log('adding :', message)

        if (typeof message.id == 'undefined') {
            throw 'Adding invalid node'
        }

        this.messages[message.id] = message

        if (parentID && parentID != message.id) {
            let parent = this.messages[parentID]

            if (!parent.children.includes(message.id)) {
                parent.children.push(message.id)
            }
        }
    }

    get(nodeID) {
        return this.messages[nodeID]
    }
}

export default MessageGraph
