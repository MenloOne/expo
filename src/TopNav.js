import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withEth } from './EthContext'

import './css/sb-admin.css';

const smallIm = require('./images/guild/small-img.png');
const logo = require('./images/logo.jpg');
const userIm = require('./images/user-1.png');
const user2Im = require('./images/user-2.png');
const iconIm = require('./images/icon.png');
const starsIm = require('./images/guild/stars.png');
const smallImroot = require('./images/small-img.png');

class TopNav extends Component {
  render() {
    return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
		    <div className="container">
		        <a className="navbar-brand" href="index.html"><img src={logo} title="Menlo One" alt="Menlo One"/></a>
		        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive"
		                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
		            <span className="navbar-toggler-icon"></span>
		        </button>
		        <div className="collapse navbar-collapse" id="navbarResponsive">
		            <ul className="navbar-nav main ml-auto">
		                <li className="nav-item"><a href="/" title="Discover">Discover</a></li>
		                <li className="nav-item"><a href="/guild/" title="Guilds">Guilds</a></li>
		                <li className="nav-item"><a href="/wallet/" title="Wallet">Wallet</a></li>
		            </ul>
		            <ul className="navbar-nav ml-auto">
		                <li className="nav-item">
		                    <form className="form-inline my-2 my-lg-0 mr-lg-2">
                                <ul className="navbar-nav main ml-auto">
                                    <li className="nav-item"><a href="/wallet/" title="Wallet">${this.props.eth.account} ${this.props.eth.balance} MET</a></li>
								</ul>
		                        <div className="input-group">
		                            <input className="form-control" type="text" placeholder="Search for..." />
									<span className="input-group-append">
										<button className="btn btn-primary" type="button">
											<i className="fa fa-search"></i>
										</button>
									</span>
		                        </div>
		                    </form>
		                </li>
		                <li className="nav-item dropdown">
		                    <a className="nav-link dropdown-toggle mr-lg-2" id="messagesDropdown" href="#" data-toggle="dropdown" aria-haspopup="true"
		                       aria-expanded="false">
		                        <span className="user-img"><img src={userIm} title="Matt Nolan" alt="Matt Nolan"/></span>
		                        <span className="name">Matt Nolan</span>
		            <span className="d-lg-none">Messages
		              <span className="badge badge-pill badge-primary">12 New</span>
		            </span>
		            <span className="indicator text-primary d-none d-lg-block">
		              <i className="fa fa-fw fa-circle">3</i>
		            </span>
		                    </a>
		                    <div className="dropdown-menu" aria-labelledby="messagesDropdown">
		                        <h6 className="dropdown-header">New Messages:</h6>
		                        <div className="dropdown-divider"></div>
		                        <a className="dropdown-item" href="#">
		                            <strong>David Miller</strong>
		                            <span className="small float-right text-muted">11:21 AM</span>
		                            <div className="dropdown-message small">Hey there! This new version of SB Admin is pretty awesome! These messages clip off when they
		                                reach the end of the box so they don't overflow over to the sides!
		                            </div>
		                        </a>
		                        <div className="dropdown-divider"></div>
		                        <a className="dropdown-item" href="#">
		                            <strong>Jane Smith</strong>
		                            <span className="small float-right text-muted">11:21 AM</span>
		                            <div className="dropdown-message small">I was wondering if you could meet for an appointment at 3:00 instead of 4:00. Thanks!</div>
		                        </a>
		                        <div className="dropdown-divider"></div>
		                        <a className="dropdown-item" href="#">
		                            <strong>John Doe</strong>
		                            <span className="small float-right text-muted">11:21 AM</span>
		                            <div className="dropdown-message small">I've sent the final files over to you for review. When you're able to sign off of them let me
		                                know and we can discuss distribution.
		                            </div>
		                        </a>
		                        <div className="dropdown-divider"></div>
		                        <a className="dropdown-item small" href="#">View all messages</a>
		                    </div>
		                </li>


		            </ul>
		        </div>
		    </div>
		</nav>
    );
  }
}

export default withEth(TopNav)