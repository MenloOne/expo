import React from 'react'

import JavascriptIPFSStorage from './storage/JavascriptIPFSStorage'
import RemoteIPFSStorage from './storage/RemoteIPFSStorage'
import EthereumForum from './contracts/EthereumForum'
import EthereumLottery from './contracts/EthereumLottery'
import MessageBoardGraph from './storage/MessageBoardGraph'
import Client from './Client'

const remoteStorage = new RemoteIPFSStorage(process.env.REACT_APP_REMOTE_IPFS)
const localStorage = new JavascriptIPFSStorage()
localStorage.connectPeer(remoteStorage)

const forum = new EthereumForum()
const lottery = new EthereumLottery()
const graph = new MessageBoardGraph()

const EthContext = React.createContext({})

const client = new Client(graph, forum, lottery, localStorage, remoteStorage)


function withEth(Component) {

    // ...and returns another component...
    return function EthContextComponent(props) {
        // ... and renders the wrapped component with the context theme!
        // Notice that we pass through any additional props as well
        return (
            <EthContext.Consumer>
                {context => <Component {...props} eth={context} />}
            </EthContext.Consumer>
        );
    };
}

export {
    EthContext,
    withEth,
    client
}