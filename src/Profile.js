import React, {Component} from 'react'
import TopNav from './TopNav.js'
import MessageBoard from './messaging/MessageBoard'
import CountdownTimer from './CountdownTimer'
import ResponsiveEmbed from 'react-responsive-embed'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/sb-admin.css'

import assets from 'assets'

const screenshot = require('./images/screenshot.png')
const userIm = require('./images/user-1.png')
const user2Im = require('./images/user-2.png')
const iconIm = require('./images/icon.png')
const computer = require('./images/ICO_profile_page_svg.svg')
// const whitePaperIm = require('./images/white-paper.png')
// const globe = require('./images/globe.png')

class Profile extends Component {

    state = {
        eth: 1,
        tokens: 0,
    }

    constructor() {
        super()

        this.onEditEth = this.onEditEth.bind(this)
        this.onEditTokens = this.onEditTokens.bind(this)
    }

    componentDidMount() {
        this.onEditEth(null)
    }

    componentWillUnmount() {
    }


    onEditEth(evt) {
        let eth = 1
        if (evt) {
            eth = evt.target.value
        }
        const tokens = Math.round((eth * 12000) * 100) / 100
        this.setState({eth: eth, tokens: tokens})
    }

    onEditTokens(evt) {
        let tokens = evt.target.value
        let eth = Math.round((tokens / (12000)) * 100) / 100
        this.setState({eth: eth, tokens: tokens})
    }

    render() {
        return (
            <div>
                <TopNav/>

                <div className="game-token shadow-sm">
                    <div className="container">
                        <div className="col-md-8 game-detail-wrapper">
                            <img className="game-img" src={assets.menloFB} alt="" style={{scale: 2}}/>
                            <div className="game-detail">
                                <h2>Menlo One</h2>
                                <p>Menlo One is a powerful framework for building decentralized applications with the speed of a traditional web app. Our decentralized database and Proof-of-Reputation incentive system is the infrastructure that enables the Web 3.0 generation of marketplaces, social media platforms, and future apps to be as fast and performant as their centralized predecessors.</p>
                                <div className="locaton-tag">
                                    <span className="location"><i className="fa fa-map-marker"></i> New Jersey</span>
                                    <span className="tag"><i className="fa fa-tag"></i> Utility Token</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 game-action-wrapper">
                            <div className="header-buttons">
                                <a href="" className="btn">Watch</a>
                                <a href="" className="btn">Recommend</a>
                            </div>
                            <div className="committed">
                                <p className="total-comments">
                                    <a className="circle-btn" title=""><img src={iconIm} alt="" /></a>
                                    <span>103 accounts</span>&nbsp;currently hold Menlo ONE tokens&nbsp;</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="left-side">
                                <div className="left-side-wrapper">
                                    <div className="top-users" style={{ display: 'none' }}>
                                        <div className="members">
                                            <h3>MEMBERS 12 (3)</h3>
                                            <div className="member-users">
                                                <span className="user-img"><img src={userIm} title="user"
                                                                                alt="user"/></span>
                                                <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
                                                <span className="user-img"><img src={userIm} title="user"
                                                                                alt="user"/></span>
                                            </div>
                                            <div className="top-names"><a >@david</a>, <a >@jenny</a>,
                                                and <a >@bobNYC</a></div>
                                        </div>

                                        <div className="backers">
                                            <h3>Other Backers (1,322)</h3>
                                            <div className="member-users">
                                                <span className="user-img"><img src={userIm} title="user"
                                                                                alt="user"/></span>
                                                <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
                                                <span className="user-img"><img src={userIm} title="user"
                                                                                alt="user"/></span>
                                            </div>
                                            <div className="top-names"><a >@BlockchainCapital</a>, <a >@RogerVer</a> and 1,322 others
                                            </div>
                                        </div>

                                        <hr/>
                                    </div>


                                    <h2>The next generation of the web</h2>
                                    <h6>All of the data on this page was pulled from<br />a blockchain, but is as fast as the cloud.</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <p>This page is different from any other webpage you’ve ever used. While it may not seem like it, all of the information here was pulled in from several blockchains and decentralized systems, and there is a built in protocol for you the user to verify that. The goal of Menlo One is to make dApps as fast and easy to use as their centralized predecessors, and this page is a demonstrtion of the alpha release of our framework in action.</p>
                                        </div>
                                        <div class="col-md-6 text-center">
                                            <img src={computer} />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="left-side-wrapper">
                                    <div className='screenshot' src={screenshot} style={{ width: '100%', minHeight: '441px' }}>
                                        <ResponsiveEmbed src='https://www.youtube.com/embed/yuohXyDP1pk?rel=0' allowFullScreen />
                                    </div>
                                </div>
                            </div>

                            <div className="team left-side" style={{display: 'none'}}>
                                <h2>Team</h2>
                                <div className="team-member">
                                    <span className="user-img"><img src={userIm} title="user" alt="user"/></span>
                                    <div className="user-detail">
                                        <div className="team-member-name"><a >@wethefuture</a></div>
                                        <div className="designation">CTO</div>
                                    </div>
                                </div>
                                <div className="team-member">
                                    <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
                                    <div className="user-detail">
                                        <div className="team-member-name"><a >@greatthings</a></div>
                                        <div className="designation">COO</div>
                                    </div>
                                </div>
                            </div>


                            <div className="reviews-and-comments expert-reviews left-side" style={{display: 'none'}}>
                                <div className="Expert-Reviews">
                                    <h3> Expert Reviews </h3>
                                    <div className="boxinner">
                                        <span className="oval-1">84%</span>
                                        <div className="boxinner-text"> Blockchain Architect Guild<span>3,812 Reviews</span>
                                        </div>
                                    </div>
                                    <div className="boxinner">
                                        <span className="oval-2">92%</span>
                                        <div className="boxinner-text">Startup MBA Guild<span>401 Reviews</span>
                                        </div>
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
                                    “Love what these guys are doing.” <br/>
                                    <span className="name">- Blockchain Architect Guild</span>
                                </div>

                            </div>

                        </div>

                        <div className="col-md-4">
                            <div className="right-side-box">

                                <div className="green-bg">
                                    <div className="start-in">STARTS IN</div>

                                    <CountdownTimer date={new Date(Date.UTC(2018, 8, 17, 9, 0, 0)) }/>

                                    <div className="sold-range">
                                        <div className="who-and-how">
                                            <span className="sold-amount">$-,---</span>
                                            <span className="sold">Not Open Yet</span>
                                        </div>
                                        <div className="range-bar">
                                            <span className="range-position"></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="white-bg">
                                    <h3>ONE Token</h3>
                                    <div className="token-cal">
                                        <div className="menlo-token">
                                            <div className="name-token">Ethereum (ETH)</div>
                                            <div className="tex-field">
                                                <input type="text" value={this.state.eth}
                                                        onChange={this.onEditEth}/>
                                                <span>ETH</span>
                                            </div>
                                        </div>
                                        <div className="arrow"></div>
                                        <div className="bitkitties">
                                            <div className="name-token">Menlo One (ONE)</div>
                                            <div className="tex-field">
                                                <input type="text" value={this.state.tokens}
                                                        onChange={this.onEditTokens}/>
                                                <span>ONE</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="https://tokensale.menlo.one" className="green-btn" title="Buy Tokens">Buy Tokens</a>
                                </div>

                            </div>

                            <div className="token-metrics right-side-box white-bg">
                                <h4>Token Metrics</h4>
                                <ul>
                                    <li>
                                        <div className="name">Sale Date</div>
                                        <div className="detail">September 17, 2018</div>
                                    </li>
                                    <li>
                                        <div className="name">Token Supply</div>
                                        <div className="detail">1 Billion</div>
                                    </li>
                                    <li>
                                        <div className="name">Hour 1 Price Discount</div>
                                        <div className="detail">30% discount</div>
                                    </li>
                                    <li>
                                        <div className="name">Week 1 Price Discount</div>
                                        <div className="detail">15% discount</div>
                                    </li>
                                    <li>
                                        <div className="name">Week 2 Price Discount</div>
                                        <div className="detail">10% discount</div>
                                    </li>
                                    <li>
                                        <div className="name">Week 3 Price Discount</div>
                                        <div className="detail">5% discount</div>
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

                        </div>
                    </div>

                    <MessageBoard/>
                </div>
            </div>
        </div>
        )
    }
}

export default Profile
