import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';
import './css/guild.css';

const smallIm = require('./images/guild/small-img.png');
const logo = require('./images/logo.jpg');
const userIm = require('./images/user-1.png');
const user2Im = require('./images/user-2.png');
const iconIm = require('./images/icon.png');
const starsIm = require('./images/guild/stars.png');
const smallImroot = require('./images/small-img.png');

class Guild extends Component {
  render() {
    return (
    	<div>
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
		    <div className="container">
		        <a className="navbar-brand" href="index.html"><img src={logo} title="Menlo One" alt="Menlo One"/></a>
		        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive"
		                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
		            <span className="navbar-toggler-icon"></span>
		        </button>
		        <div className="collapse navbar-collapse" id="navbarResponsive">
		            <ul className="navbar-nav main ml-auto">
		                <li className="nav-item"><a href="/" title="Explore">Discover</a></li>
		                <li className="nav-item"><a href="/guild/" title="Discovery">Guild</a></li>
		                <li className="nav-item"><a href="/profile/" title="Connections">Profile</a></li>
		                <li className="nav-item"><a href="/wallet/" title="Connections">Wallet</a></li>
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

		<div className="game-token shadow-sm">
		    <div className="container">
		        <span className="game-img"><img src={smallIm} alt=""/></span>
		        <div className="game-detail">
		            <h2>Blockchain Devs HashGuild</h2>
		            <p>We review awesome, intelligent and groundbreaking projects.</p>
		            <div className="locaton-tag">
		                <span className="location"><i className="fa fa-map-marker"></i> San Francisco</span>
		                <span className="tag"><i className="fa fa-tag"></i> Tech, Business</span>
		            </div>
		        </div>
		        <div className="btn-top-right">
		            <a href="#" className="circle-btn" title=""><img src={iconIm} alt=""/></a>
		            <a href="#" className="btn border-button" title="Watch">Watch</a>
		        </div>

		        <div className="total-comments">
		            <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		            <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
		            <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		            <a href="#">3 friends</a> and 2,599 others watching
		        </div>
		    </div>
		</div>

		<div className="content-wrapper">
		    <div className="container">
		        <div className="row">
		            <div className="col-md-12">
		                <div className="left-side">
		                    <div className="members-top-title">
		                        <h2>Members (12)</h2>
		                        <a href="#" className="more-members-cto">See All Members</a>
		                        <div className="clearfix"></div>
		                    </div>
		                    <ul className="members-list">
		                        <li>
		                            <div className="im-holder"></div>
		                            <span className="member-name">@matta</span>
		                            <p>
		                                0x92763
		                                <br />
		                                Rep: 1,248
		                            </p>
		                        </li>
		                        <li>
		                            <div className="im-holder"></div>
		                            <span className="member-name">@matta</span>
		                            <p>
		                                0x92763
		                                <br />
		                                Rep: 1,248
		                            </p>
		                        </li>
		                        <li>
		                            <div className="im-holder"></div>
		                            <span className="member-name">@matta</span>
		                            <p>
		                                0x92763
		                                <br />
		                                Rep: 1,248
		                            </p>
		                        </li>
		                        <li>
		                            <div className="im-holder"></div>
		                            <span className="member-name">@matta</span>
		                            <p>
		                                0x92763
		                                <br />
		                                Rep: 1,248
		                            </p>
		                        </li>
		                        <li>
		                            <div className="im-holder"></div>
		                            <span className="member-name">@matta</span>
		                            <p>
		                                0x92763
		                                <br />
		                                Rep: 1,248
		                            </p>
		                        </li>
		                        <li>
		                            <div className="im-holder"></div>
		                            <span className="member-name">@matta</span>
		                            <p>
		                                0x92763
		                                <br />
		                                Rep: 1,248
		                            </p>
		                        </li>
		                        <li>
		                            <div className="im-holder"></div>
		                            <span className="member-name">@matta</span>
		                            <p>
		                                0x92763
		                                <br />
		                                Rep: 1,248
		                            </p>
		                        </li>
		                    </ul>
		                    
		                </div>
		                <div className="members-bottom-sec">
		                    <div className="row">
		                        <div className="col-md-6 stats-main-wrapper">
		                            <ul className="guild-stats stats-left">
		                                <li><h4>Guild Stats</h4></li>
		                                <li><p>Reivews: 237</p></li>
		                                <li><p>Avg Grade: 72%</p></li>
		                                <li><p>Avg Payout: 42 MET</p></li>
		                            </ul>
		                            <ul className="guild-stats stats-right">
		                                <li><p>Rep:<img src={starsIm} /></p></li>
		                                <li><p>Status: Crypto-Boss</p></li>
		                                <li><p>Categories: <a href="#">Tech</a>, <a href="#">Business</a></p></li>
		                            </ul>
		                            <div className="clearfix"></div>
		                        </div>
		                        <div className="col-md-6 members-apply">
		                            <p>Currently accepting new members!</p>
		                            <a href="#" className="blue-btn">Apply to Join</a>
		                        </div>
		                    </div>

		                </div>
		            </div>
		            <div className="col-md-12">
		                 <ul className="top-panels-menu">
		                    <li><a href="#" className="active">Open Sales (3)</a></li>
		                    <li><a href="#">Past (234)</a></li>
		                    <li><a href="#">Scam List (18)g</a></li>
		                </ul>
		                <div className="game-token shadow-sm">
		                <div className="container">
		                <span className="game-img"><img src={smallImroot} alt="" /></span>
		                <div className="game-detail">
		                <h2>BitKitties</h2>
		                <p>A game where users win tokens for catching mice</p>
		                <div className="tw">
		                <span className="user-img"><img src={userIm} title="user" alt="user" /></span>
		                <span className="user-img"><img src={user2Im} title="user" alt="user" /></span>
		                <span className="user-img"><img src={userIm} title="user" alt="user" /></span>
		                <a href="#">6 friends</a> and 1,353 others committed to buying when sale opens
		                </div>
		                </div>
		                <div className="btn-top-right">
		                <a href="#" className="circle-btn" title=""><img src={iconIm} alt="" /></a>
		                <a href="#" className="btn border-button" title="Watch">Allocated</a>
		                </div>


		                </div>
		                </div> 
		            </div>   
		        </div>
		    </div>
		</div>
		</div>
    );
  }
}

export default Guild;
