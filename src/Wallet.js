import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';
import './css/wallet.css';

class Wallet extends Component {
  render() {
    return (
    	<div>
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
		    <div className="container">
		        <a className="navbar-brand" href="index.html"><img src="images/logo.jpg" title="Menlo One" alt="Menlo One"/></a>
		        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive"
		                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
		            <span className="navbar-toggler-icon"></span>
		        </button>
		        <div className="collapse navbar-collapse" id="navbarResponsive">
		            <ul className="navbar-nav main ml-auto">
		                <li className="nav-item"><a href="#" title="Explore">Explore</a></li>
		                <li className="nav-item"><a href="#" title="Discovery">Discovery</a></li>
		                <li className="nav-item"><a href="#" title="Connections">Connections</a></li>
		            </ul>
		            <ul className="navbar-nav ml-auto">
		                <li className="nav-item">
		                    <form className="form-inline my-2 my-lg-0 mr-lg-2">
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
		                        <span className="user-img"><img src="images/user-1.png" title="Matt Nolan" alt="Matt Nolan"/></span>
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

		<div className="wallet-sub-nav-wrapper">
		    <div className="container">
		        <ul className="wallet-sub-nav">
		            <li><a href="#">Dashboard</a></li>
		            <li><a href="#">Live</a></li>
		            <li><a href="#">Upcoming</a></li>
		            <li><a href="#">Buy/Sell</a></li>
		            <li><a href="#">Accounts</a></li>
		        </ul>
		    </div>
		</div>
		<ul className="wallet-panels-menu">
		    <li><a href="#" className="active">Live</a></li>
		    <li><a href="#">Upcoming</a></li>
		</ul>
		<div className="wallet-main-panels">
		    <div className="container">
		        <div className="row">
		            <div className="col-md-4 item-wrapper">
		                <img src="images/small-img.png" className="item-thumbnail" />
		                <h3>BitKitties</h3>
		                <ul className="details-list">
		                    <li>
		                        <span>TOKENS</span>
		                        <p>50 BTK</p>
		                    </li>
		                    <li>
		                        <span>PRICE</span>
		                        <p>0.01 ETH</p>
		                    </li>
		                    <li>
		                        <span>DISCOUNT</span>
		                        <p>50%</p>
		                    </li>
		                </ul>
		                <div className="item-wrapper-foot">
		                    <p className="wrapper-foot-title">TOKEN LOCKUP ENDS</p>
		                    <p className="time">04:12:09:22</p>
		                </div>
		            </div>
		            <div className="col-md-4 item-wrapper">
		                <img src="images/small-img.png" className="item-thumbnail" />
		                <h3>LocoCoin</h3>
		                <ul className="details-list">
		                    <li>
		                        <span>TOKENS</span>
		                        <p>827 LCC</p>
		                    </li>
		                    <li>
		                        <span>PRICE</span>
		                        <p>0.05 ETH</p>
		                    </li>
		                    <li>
		                        <span>DISCOUNT</span>
		                        <p>15%</p>
		                    </li>
		                </ul>
		            </div>
		            <div className="col-md-4 item-wrapper">
		                <img src="images/small-img.png" className="item-thumbnail" />
		                <h3>Kapital</h3>
		                <ul className="details-list">
		                    <li>
		                        <span>TOKENS</span>
		                        <p>1,211 KAP</p>
		                    </li>
		                    <li>
		                        <span>PRICE</span>
		                        <p>0.01 ETH</p>
		                    </li>
		                    <li>
		                        <span>DISCOUNT</span>
		                        <p>75%</p>
		                    </li>
		                </ul>
		            </div>
		        </div>
		    </div>
		</div>
		</div>
    );
  }
}

export default Wallet;
