import React, {Component} from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import {withEth} from './EthContext'

import web3 from './web3_override'
import TruffleContract from 'truffle-contract'
import MenloFaucetContract from './truffle_artifacts/contracts/MenloFaucet.json'

import './css/sb-admin.css'

const smallIm = require('./images/guild/small-img.png')
const logo = require('./images/logo.jpg')
const userIm = require('./images/user-1.png')
const user2Im = require('./images/user-2.png')
const iconIm = require('./images/icon.png')
const starsIm = require('./images/guild/stars.png')
const smallImroot = require('./images/small-img.png')



class TopNav extends Component {

    constructor() {
        super()
        this.onGetTokens = this.onGetTokens.bind(this)
    }

    async onGetTokens() {
        if (this.props.eth.state !== 'ok') {
            return
        }

        try {
            let faucetContract = TruffleContract(MenloFaucetContract)
            faucetContract.defaults({
                from: this.props.eth.account
            })
            faucetContract.setProvider(web3.currentProvider)

            let faucet = await faucetContract.deployed()
            await faucet.drip()
        } catch (e) {
            window.alert( e )
        }
    }

    renderONE() {
        let one = this.props.eth.balance

        if (one == 0) {
            return (
                <li className="nav-item token-number">
                    <button href='#' className='btn faucet-btn' onClick={ this.onGetTokens }>GET ONE TOKENS FROM KOVAN FAUCET</button>
                </li>
            )
        }

        return (
            <li className="nav-item token-number">
                <span>{ one }</span>
                <span className="token-one">&nbsp;ONE</span>
            </li>
        )
    }

    renderAccountStatus() {
        console.log( 'STATUS: ', this.props.eth.status )

        if (this.props.eth.status === 'logged out') {
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item token-number">
                        <span className="token-one">YOU MUST SIGN INTO METAMASK TO TAKE PART IN DISCUSSIONS</span>
                    </li>
                </ul>
            )
        }

        if (this.props.eth.status === 'uninstalled') {
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item token-number">
                        <span className="token-one">YOU MUST USE CHROME WITH THE METAMASK EXTENSION TO TAKER PART IN DISCUSSINS</span>
                    </li>
                </ul>
            )
        }

        if (this.props.eth.status === 'starting') {
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item token-number">
                        <span className="token-one">...</span>
                    </li>
                </ul>
            )
        }

        return (
            <ul className="navbar-nav ml-auto">
                { this.renderONE() }

                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle mr-lg-2"
                       id="messagesDropdown"
                       href="#"
                       data-toggle="dropdown"
                       aria-haspopup="true"
                       aria-expanded="false">

                        <span className="user-img">
                            {this.props.eth.avatar}
                        </span>
                        <span className="name">{ this.props.eth.account }</span>

                        { false &&
                        <span className="indicator text-primary d-none d-lg-block">
                                          <i className="fa fa-fw fa-circle">3</i>
                                        </span>
                        }
                    </a>

                    <div className="dropdown-menu" aria-labelledby="messagesDropdown">
                        <h6 className="dropdown-header">New Messages:</h6>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">
                            <strong>David Miller</strong>
                            <span className="small float-right text-muted">11:21 AM</span>
                            <div className="dropdown-message small">Hey there! This new version of SB Admin
                                is pretty awesome! These messages clip off when they
                                reach the end of the box so they don't overflow over to the sides!
                            </div>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">
                            <strong>Jane Smith</strong>
                            <span className="small float-right text-muted">11:21 AM</span>
                            <div className="dropdown-message small">I was wondering if you could meet for an
                                appointment at 3:00 instead of 4:00. Thanks!
                            </div>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">
                            <strong>John Doe</strong>
                            <span className="small float-right text-muted">11:21 AM</span>
                            <div className="dropdown-message small">I've sent the final files over to you
                                for review. When you're able to sign off of them let me
                                know and we can discuss distribution.
                            </div>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item small" href="#">View all messages</a>
                    </div>
                </li>
            </ul>
        )
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                <div className="container">
                    <a className="navbar-brand" href="index.html"><img src={logo} title="Menlo One"
                                                                       alt="Menlo One"/></a>
                    <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                            data-target="#navbarResponsive"
                            aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav main ml-auto" style={{display: 'none'}}>
                            <li className="nav-item"><a href="/" title="Discover">Discover</a></li>
                            <li className="nav-item"><a href="/guild/" title="Guilds">Guilds</a></li>
                            <li className="nav-item"><a href="/wallet/" title="Wallet">Wallet</a></li>
                        </ul>

                        { this.renderAccountStatus(this.props.eth.status) }
                    </div>
                </div>
            </nav>
        )
    }
}

export default withEth(TopNav)
