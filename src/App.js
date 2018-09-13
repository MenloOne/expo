import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Blockies from 'react-blockies'

import Profile from './Profile'
import { EthContext } from './EthContext'
import ForumService from './services/ForumService'
import web3 from './web3_override'

class App extends React.Component {

    state = {
        ethContext: {
            forumService: new ForumService(),
            account: null,
            balance: '-',
            status: 'starting',
            ready: new Promise((resolve) => { this.resolveReady = resolve })
        }
    }

    constructor() {
        super()
        this.refreshAccount = this.refreshAccount.bind(this)
    }

    componentWillMount() {
        if (!web3) {
            let ethContext = Object.assign(this.state.ethContext, { status: 'uninstalled' })
            this.setState({ ethContext })
            return
        }

        web3.currentProvider.publicConfigStore.on('update', this.checkMetamaskStatus.bind(this))
        this.checkMetamaskStatus()
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        window.clearInterval(this.accountInterval);
    }

    async checkMetamaskStatus() {
        let self = this

        web3.eth.getAccounts((err, accounts) => {
            if (err || !accounts || accounts.length === 0) {
                let ethContext = Object.assign(this.state.ethContext, { status: 'logged out' })
                this.setState({ ethContext })
                return
            }

            if (self.state.ethContext.status !== 'starting' && self.state.ethContext.status !== 'ok') {
                self.refreshAccount( true )
            }

            if (accounts[0] !== self.state.ethContext.account) {
                // The only time we ever want to load data from the chain history
                // is when we receive a change in accounts - this happens anytime
                // the page is initially loaded or if there is a change in the account info
                // via a metamask interaction.
                web3.eth.defaultAccount = accounts[0]

                self.refreshAccount( self.state.ethContext.account !== null, accounts[0] )
            }
        });
    }

    async refreshBalance() {
        let self = this

        setTimeout(async () => {
            let eth = self.state.ethContext

            let balance = await eth.forumService.getBalance()
            let ethContext = Object.assign({}, eth, { balance })

            self.setState({
                ethContext
            })
        }, 4000)
    }

    async refreshAccount(refreshBoard, account) {
        try {
            if (refreshBoard) {
                // Easy way out for now
                window.location.reload()
            }

            let acct = {
                account: account,
                avatar: <Blockies seed={account} size={10} />,
                refreshBalance: this.refreshBalance.bind(this)
            }

            await this.state.ethContext.forumService.setAccount(acct)
            let balance = await this.state.ethContext.forumService.getBalance()

            let ethContext = Object.assign({}, this.state.ethContext, {
                status: 'ok',
                balance,
                ...acct
            })

            this.setState({
                ethContext
            })

            this.resolveReady()

        } catch(e) {
            console.error(e)
        }
    }

    render() {
        return (
            <EthContext.Provider value={this.state.ethContext}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Profile}/>
                        <Route path="/menlo" exact component={Profile}/>
                    </Switch>
                </BrowserRouter>
            </EthContext.Provider>
        )
    }
}

export default App
