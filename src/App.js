import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Blockies from 'react-blockies'

import Profile from './Profile'
import { EthContext } from './EthContext'
import Client from './Client'
import web3 from './web3_override'

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class App extends React.Component {

    state = {
        ethContext: {
            messageBoard: new Client(),
            account: null,
            balance: '-',
            status: 'starting',
        }
    }

    constructor() {
        super()
        this.refreshAccount = this.refreshAccount.bind(this)
    }

    componentWillMount() {
        this.accountInterval = window.setInterval( () => { this.checkMetamaskStatus(); }, 1000);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        window.clearInterval(this.accountInterval);
    }

    async checkMetamaskStatus() {
        let self = this

        if (!web3) {
            this.setState({
                ethContext: {
                    status: 'uninstalled',
                }
            })
            return
        }

        web3.eth.getAccounts((err, accounts) => {
            if (err || !accounts || accounts.length === 0) {
                self.setState({
                    ethContext: {
                        status: 'logged out',
                    }
                })
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
        let eth = this.state.ethContext

        let details = await eth.messageBoard.setAccount(eth.account)
        let balance = await eth.messageBoard.getBalance()

        let ethContext = Object.assign({}, eth, { balance })

        this.setState({
            ethContext
        })
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

            await this.state.ethContext.messageBoard.setAccount(acct)
            let balance = await this.state.ethContext.messageBoard.getBalance()

            let ethContext = Object.assign({}, this.state.ethContext, {
                status: 'ok',
                balance,
                ...acct
            })

            this.setState({
                ethContext
            })

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
