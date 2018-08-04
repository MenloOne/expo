import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Discover from './Discover'
import Wallet from './Wallet'
import Guild from './Guild'
import Profile from './Profile'
import {client, EthContext, fakeClient} from './EthContext'

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
      balance: '3,089',
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

  refreshAccount() {
    client.getAccountDetails()
      .then(({account, balance}) => {
        this.setState({ ethContext: {
            client: client,
            account,
            balance: balance.toFormat(0),
            isAuthenticated: true,
            isLoading: false,
            refreshAccount: this.refreshAccount
          }
        })
      })
      .catch(() => this.setState({ ethContext: {
          client: fakeClient,
          account: '',
          balance: '3,089',
          isAuthenticated: false,
          isLoading: false,
          refreshAccount: this.refreshAccount
        }
      }))
  }

  render() {
    return (
      <EthContext.Provider value={this.state.ethContext}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Discover}/>
            <Route path="/wallet" exact component={Wallet}/>
            <Route path="/guild" exact component={Guild}/>
            <Route path="/profile" exact component={Profile}/>
          </Switch>
        </BrowserRouter>
      </EthContext.Provider>
    )
  }
}

export default App
