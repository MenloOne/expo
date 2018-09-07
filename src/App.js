import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Discover from './Discover'
import Wallet from './Wallet'
import Guild from './Guild'
import Profile from './Profile'
import { client, EthContext, fakeClient } from './EthContext'

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class App extends React.Component {

    state = {
        ethContext: {
            client: client,
            account: '',
            balance: '-',
            isAuthenticated: false,
            isLoading: true,
            refreshAccount: () => {
            }
        }
    }

    constructor() {
        super()

        this.refreshAccount = this.refreshAccount.bind(this)
    }

    componentWillMount() {
        this.refreshAccount()
    }

    async refreshAccount() {
        try {
            let details = await client.getAccountDetails()

            this.setState({
                ethContext: {
                    client: client,
                    account: details.account,
                    avatar: details.avatar,
                    balance: details.balance.toFormat(0),
                    isAuthenticated: true,
                    isLoading: false,
                    refreshAccount: this.refreshAccount
                }
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
