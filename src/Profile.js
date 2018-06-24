import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';

const logo = require('./images/logo.jpg');
const userIm = require('./images/user-1.png');
const user2Im = require('./images/user-2.png');
const iconIm = require('./images/icon.png');
const smallImroot = require('./images/small-img.png');
const whitePaperIm = require('./images/white-paper.png');

class Profile extends Component {
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

		<div className="recommended-for-you">
		    <div className="container">
		        <span className="user-img"><img src={userIm} title="user" alt="user"/></span>Recommended for you by <a href="#">@Jason</a>
		    </div>
		</div>

		<div className="game-token shadow-sm">
		    <div className="container">
		        <span className="game-img"><img src={smallImroot} alt=""/></span>
		        <div className="game-detail">
		            <h2>BitKitties</h2>
		            <p>A game where users win tokens for catching mice</p>
		            <div className="locaton-tag">
		                <span className="location"><i className="fa fa-map-marker"></i> San Francisco</span>
		                <span className="tag"><i className="fa fa-tag"></i> Utility Token</span>
		            </div>
		        </div>
		        <div className="btn-top-right">
		            <a href="#" className="circle-btn" title=""><img src={iconIm} alt=""/></a>
		            <a href="#" className="btn border-button" title="Watch">Watch</a>
		            <a href="#" className="btn border-button" title="Recommend">Recommend</a>
		        </div>

		        <div className="total-comments">
		            <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		            <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
		            <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		            <a href="#">6 friends</a> and 1,353 others committed to buying when sale opens
		        </div>
		    </div>
		</div>

		<div className="content-wrapper">
		    <div className="container">
		        <div className="row">
		            <div className="col-md-8">
		                <div className="left-side">
		                    <div className="top-users">

		                        <div className="members">
		                            <h3>MEMBERS 12 (3)</h3>
		                            <div className="member-users">
		                                <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		                                <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
		                                <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		                            </div>
		                            <div className="top-names"><a href="#">@david</a>, <a href="#">@jenny</a>, and <a href="#">@bobNYC</a></div>
		                        </div>

		                        <div className="backers">
		                            <h3>Other Backers (1,322)</h3>
		                            <div className="member-users">
		                                <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		                                <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
		                                <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		                            </div>
		                            <div className="top-names"><a href="#">@BlockchainCapital</a>, <a href="#">@RogerVer</a> and 1,322 others</div>
		                        </div>

		                    </div>

		                    <hr/>

		                    <h2>About BITKITTIES</h2>
		                    <p>Collect and trade BitKitties in one of the world's first blockchain games. Breed your rarest kitties to create the top mice catcher. Live
		                        long and prospurr.</p>
		                    <iframe src="#" width="100%" height="441px"></iframe>

		                    <hr/>

		                    <div className="tokens-detail ">
		                        <div className="token">
		                            <h4>Token distribution</h4>
		                            <ul>
		                                <li><b>44%</b> ICO</li>
		                                <li><b>4%</b> Teamt</li>
		                                <li><b>52%</b> Development</li>
		                            </ul>
		                        </div>
		                        <div className="token">
		                            <h4>Token generation cap</h4>
		                            <ul>
		                                <li><b>5,000,000,000</b> BTK</li>
		                            </ul>
		                        </div>
		                        <div className="token">
		                            <h4>Token exchange</h4>
		                            <ul>
		                                <li><b>1 BTK - 0.1000</b> USD</li>
		                            </ul>
		                        </div>
		                    </div>

		                </div>

		                <div className="team left-side">
		                    <h2>Team</h2>
		                    <div className="team-member">
		                        <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		                        <div className="user-detail">
		                            <div className="team-member-name"><a href="#">@wethefuture</a></div>
		                            <div className="designation">CTO</div>
		                        </div>
		                    </div>
		                    <div className="team-member">
		                        <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
		                        <div className="user-detail">
		                            <div className="team-member-name"><a href="#">@wethefuture</a></div>
		                            <div className="designation">CTO</div>
		                        </div>
		                    </div>
		                </div>


		                <div className="reviews-and-comments expert-reviews left-side">
		                    <div className="Expert-Reviews">
		                        <h3> Expert Reviews </h3>
		                        <div className="boxinner">
		                            <span className="oval-1">84%</span>
		                            <div className="boxinner-text"> Blockchain Architect Guild<span>3,812 Reviews</span></div>
		                        </div>
		                        <div className="boxinner">
		                            <span className="oval-2">92%</span>
		                            <div className="boxinner-text">Startup MBA Guild<span>401 Reviews</span></div>
		                        </div>
		                    </div>
		                    <div className="User-Reviews">
		                        <h3>User Reviews</h3>
		                        <div className="Profile">
		                            <i className="fa fa-thumbs-up"></i>
		                            12
		                        </div>
		                        <div className="Profile">
		                            <i className="fa fa-thumbs-down"></i>
		                            109
		                        </div>

		                    </div>
		                    <div className="awesome-product-aw">
		                        “Awesome product, awesome team. I’d back anything these guys do.” <br />
		                        <span className="name">- Blockchain Architect Guild</span>
		                    </div>


		                </div>
		                <div className="expert-reviews-1 left-side">
		                    <div className="comments">
		                        <ul>
		                            <li className="borderis">
		                                <div className="icon"><img src={userIm} alt="" /></div>
		                                <div className="content">
		                                    <h3 className="tag-name">@wethefuture <span className="points">255 points </span> <span className="time">15 hours ago</span> <span
		                                            className="btn">Team</span></h3>
		                                    <div className="comments-text">Many meows ago, we had this idea – what if we built a game on the blockchain. We had no idea what
		                                        tho. You’re probably like, ‘you got to be kitten me’, but really - we just knew we wanted a game! So here we are. Hope
		                                        you have fun! Live long and prospurr.
		                                    </div>
		                                    <div className="comments-review">
		                                        <span><i className="fa fa-caret-up"></i> Upvote (12)</span>
		                                        <span><i className="fa fa-caret-down"></i> Downvote </span>
		                                        <span>Reply</span>
		                                        <span>Permalink</span>
		                                        <span>Report</span>
		                                    </div>
		                                </div>

		                                <ul>
		                                    <li>
		                                        <div className="icon"><img src={user2Im} alt="" /></div>
		                                        <div className="content">
		                                            <h3 className="tag-name">@s0l0 <span className="points">12 points </span> <span className="time">22 hours ago </span></h3>
		                                            <div className="comments-text">I think this project is an interesting use of blockchain technology and who doesn’t lo…
		                                            </div>
		                                            <div className="comments-review">
		                                                <span><em className="blue"><i className="fa fa-caret-up"></i> Upvote </em>(12)</span>
		                                                <span><i className="fa fa-caret-down"></i> Downvote </span>
		                                                <span>Reply</span>
		                                                <span>Permalink</span>
		                                                <span>Report</span>
		                                            </div>
		                                            <div className="comments-review">
		                                                <em className="blue">Load More Comments </em>(122 replies)
		                                            </div>
		                                            <textarea name="" className="field" id="" cols="30" rows="10"></textarea>
		                                            <input type="submit" className="submit-btn" />
		                                            <a href="" className="cancle-btn">Cancle</a>
		                                        </div>
		                                    </li>

		                                </ul>
		                            </li>
		                            <li>
		                                <div className="icon"><img src={userIm} alt="" /></div>
		                                <div className="content">
		                                    <h3 className="tag-name">@gabbym <span className="points">255 points </span> <span className="time">15 hours ago</span></h3>
		                                    <div className="comments-text">CUUUUUUTE! Nice job guys! Can’t wait to try this out.</div>
		                                    <div className="comments-review">
		                                        <span><i className="fa fa-caret-up"></i> Upvote (12)</span>
		                                        <span><i className="fa fa-caret-down"></i> Downvote </span>
		                                        <span>Reply</span>
		                                        <span>Permalink</span>
		                                        <span>Report</span>
		                                    </div>
		                                </div>
		                            </li>
		                        </ul>
		                    </div>
		                </div>


		            </div>

		            <div className="col-md-4">
		                <div className="right-side-box">

		                    <div className="green-bg">
		                        <div className="start-in">STARTS IN</div>
		                        <div className="time-watch">
		                            <div>24<span>Days</span></div>
		                            <div className="dots">:</div>
		                            <div>12<span>Hours</span></div>
		                            <div className="dots">:</div>
		                            <div>09<span>Minutes</span></div>
		                            <div className="dots">:</div>
		                            <div>22<span>Seconds</span></div>
		                        </div>
		                        <div className="sold-range">
		                            <div className="who-and-how">
		                                <span className="sold-amount">$9,239,190</span>
		                                <span className="sold">75% Sold</span>
		                            </div>
		                            <div className="range-bar">
		                                <span className="range-position"></span>
		                            </div>
		                        </div>
		                    </div>

		                    <div className="white-bg">
		                        <h3>BitKitties</h3>
		                        <div className="token-cal">
		                            <div className="menlo-token">
		                                <div className="name-token">Menlo Token (MET)</div>
		                                <div className="tex-field">
		                                    <input type="text" value="12"/>
		                                    <span>ETH</span>
		                                </div>
		                                <div className="offer">Approx. $391.20</div>
		                            </div>
		                            <div className="arrow"></div>
		                            <div className="bitkitties">
		                                <div className="name-token">BitKitties (BTK)</div>
		                                <div className="tex-field">
		                                    <input type="text" value="5,500"/>
		                                    <span>BTK</span>
		                                </div>
		                                <div className="offer">Including 30% discount</div>
		                            </div>
		                        </div>
		                        <a href="#" className="green-btn" title="Get Allocation">Get Allocation</a>
		                        <p>Your Menlo wallet will auto-buy BTK at a 30% discount when sale opens June 26.</p>
		                    </div>

		                </div>

		                <div className="token-metrics right-side-box white-bg">
		                    <h4>Token Metrics</h4>
		                    <ul>
		                        <li>
		                            <div className="name">Sale Date</div>
		                            <div className="detail">June 26, 2018</div>
		                        </li>
		                        <li>
		                            <div className="name">Pegging Parity</div>
		                            <div className="detail">1:500:5000</div>
		                        </li>
		                        <li>
		                            <div className="name">Price</div>
		                            <div className="detail">$.10/.000000 ETH</div>
		                        </li>
		                        <li>
		                            <div className="name">Token Supply</div>
		                            <div className="detail">1 Billion</div>
		                        </li>
		                        <li>
		                            <div className="name">T1 Price Discount</div>
		                            <div className="detail">50% discount</div>
		                        </li>
		                        <li>
		                            <div className="name">T2 Price Discount</div>
		                            <div className="detail">$40% discount</div>
		                        </li>
		                        <li>
		                            <div className="name">Lockup (presale)</div>
		                            <div className="detail">90 days</div>
		                        </li>
		                        <li>
		                            <div className="name">Lockup (team)</div>
		                            <div className="detail">2 month lockup, 2 year vest</div>
		                        </li>
		                        <li>
		                            <div className="name">Lockup (advisors)</div>
		                            <div className="detail">2 month lockup, 2 year vest</div>
		                        </li>
		                    </ul>
		                </div>

		                <div className="right-side-box moreinfo">
		                    <h3>More Info</h3>
		                    <div className="info-item"><img src={whitePaperIm} alt="" width="36" height="31" /> <span>White Paper</span> <i
		                            className="fa fa-angle-right"></i>
		                    </div>
		                    <div className="info-item"><img src="images/globe.png" alt="" width="29" height="29" />
		                        <span>Website <em>http://bitkitttttttiezz.com</em></span>
		                        <i className="fa fa-angle-right"></i>
		                    </div>
		                    <div className="social-links">
		                        <a href="#" title="Twitter"><i className="fa fa-twitter"></i></a>
		                        <a href="#" title="Facebook"><i className="fa fa-facebook"></i></a>
		                        <a href="#" title="GitHub"><i className="fa fa-github"></i></a>
		                        <a href="#" title="Hash"><i className="fa fa-slack"></i></a>
		                        <a href="#" title="Flag"><i className="fa fa-paper-plane"></i></a>
		                    </div>
		                </div>


		                <div className="right-side-box alsolike">
		                    <h3>You may also li</h3>
		                    <div className="list-group list-group-flush small">
		                        <div className="list-group-item list-group-item-action">
		                            <div className="media">
		                                <img className="d-flex mr-3  " src="images/also-1.png" alt="" />
		                                <div className="media-body">
		                                    <a href="#">LiveTree ADEPT</a>
		                                    <div className="text-muted smaller">Car insurance that charges you only when you’re behind the wheel.</div>
		                                </div>
		                            </div>
		                        </div>

		                        <div className="list-group-item list-group-item-action">
		                            <div className="media">
		                                <img className="d-flex mr-3  " src="images/also-2.png" alt="" />
		                                <div className="media-body">
		                                    <a href="#">Halo</a>
		                                    <div className="text-muted smaller">A community for photographers</div>
		                                </div>
		                            </div>
		                        </div>

		                        <div className="list-group-item list-group-item-action">
		                            <div className="media">
		                                <img className="d-flex mr-3  " src="images/also-3.png" alt="" />

		                                <div className="media-body">
		                                    <a href="#">Let’s Go</a>
		                                    <div className="text-muted smaller">Foursquare on the blockchain</div>
		                                </div>
		                            </div>
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

export default Profile;
