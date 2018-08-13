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

import IPFS from 'ipfs'
import HashUtils from 'HashUtils'

class JavascriptIPFSStorage {
  constructor() {
    this.ipfs = new IPFS()
    this.messagesList = []
    this.connectedToPeer = false
  }

  createMessage(message) {
    return new Promise((resolve, reject) => {
      HashUtils.nodeToCID(message, (cidErr, cid) => {
        this.ipfs.dag.put(message, {cid: cid}, (putErr, result) => {
          this.messagesList.push(message)
          resolve(result.toBaseEncodedString())
        })
      })
    })
  }

  findMessage(hash) {
    return new Promise((resolve, reject) => {
      this.ipfs.dag.get(hash, (err, result) => {
        result ? resolve({...result.value, hash: hash}) : resolve(null)
      })
    })
  }

  connectPeer(remote) {
    this.ipfs.on('ready', () => {
      new Promise((resolve, reject) => {
        remote.connection.id((err, result) => {
          if (err) {
            reject(err)
            return
          }

          console.log('Found IPFS addresses ' + result.addresses)

          // Must find websocket based address to connect to as we're in browser
          let wsAddress = result.addresses.find(a => a.includes('8081/ws/'))
          if (!wsAddress) {
            reject('No Websocket connection exposed by ipfs.menlo.one')
            return
          }

          // The Menlo NGINX proxy converts WSS:4002 to WS:8081
          this.ipfs.swarm.connect('/dns4/ipfs.menlo.one/4002/wss/QmQP5wZGuFEF5Vxb6UmvwKuS9DVNCGz975aRXVLFHK1z3s', (connectErr, connectResult) => {
            if (connectErr) {
              reject(connectErr)
            } else {
              this.connectedToPeer = true
              resolve()
            }
          })
        })
      })
    })
  }

  isOnline() {
    return this.ipfs.isOnline() && this.connectedToPeer
  }
}

export default JavascriptIPFSStorage
