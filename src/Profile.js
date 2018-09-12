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
const whitePaperIm = require('./images/white-paper.png')
const globe = require('./images/globe.png')

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
                        <span className="game-img"><img src={assets.menloFB} alt="" style={{scale: 2}}/></span>
                        <div className="game-detail">
                            <h2>Menlo One</h2>
                            <p>Menlo One is a powerful framework for building decentralized applications with the speed of a traditional web app. Our decentralized database and Proof-of-Reputation incentive system is the infrastructure that enables the Web 3.0 generation of marketplaces, social media platforms, and future apps to be as fast and performant as their centralized predecessors.</p>
                            <div className="locaton-tag">
                                <span className="location"><i className="fa fa-map-marker"></i> New Jersey</span>
                                <span className="tag"><i className="fa fa-tag"></i> Utility Token</span>
                            </div>
                        </div>
                        <div className="btn-top-right">
                            <span className="total-comments">
                                832 committed to buying when sale opens &nbsp;
                            </span>
                            <a className="circle-btn" title=""><img src={iconIm} alt=""/></a>
                        </div>

                    </div>
                </div>

                <div className="content-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="left-side">
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


                                    <h2>About Menlo One</h2>
                                    <p>Menlo One gives developers the essential building blocks for decentralized apps. From a distributed database, to a proof of reputation algorithm, to transactions and governance, our framework gives you the tools you need without having to build them from scratch. We re-imagined the web stack for a future with no administrators, censors, or single point of failure.</p>

                                    <div className='screenshot' src={screenshot} style={{ width: '100%', height: '441px' }}>
                                        <ResponsiveEmbed src='https://www.youtube.com/embed/yuohXyDP1pk?rel=0' allowFullScreen />
                                    </div>

                                    <hr/>

                                    <div className="tokens-detail ">
                                        <div className="token">
                                            <h4>Token distribution</h4>
                                            <ul>
                                                <li><b>35.4%</b> ICO</li>
                                                <li><b>24.6%</b> Future Growth</li>
                                                <li><b>20%</b> Team</li>
                                                <li><b>10%</b> Advisors</li>
                                                <li><b>10%</b> Partners</li>
                                            </ul>
                                        </div>
                                        <div className="token">
                                            <h4>Token generation cap</h4>
                                            <ul>
                                                <li><b>1,000,000,000</b> ONE</li>
                                            </ul>
                                        </div>
                                        <div className="token">
                                            <h4>Token exchange</h4>
                                            <ul>
                                                <li><b>1 ONE - 12,000</b> ETH</li>
                                            </ul>
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

                                <MessageBoard/>

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

                                <div className="right-side-box moreinfo">
                                    <h3>More Info</h3>
                                    <a href='https://menloone.docsend.com/view/uu6vcy9'>
                                        <div className="info-item">
                                            <div className="btn-icon"><img src={whitePaperIm} alt="" width="36" height="31"/></div>
                                            <div className="btn-label">
                                                <span>White Paper</span>
                                                <i className="fa fa-angle-right"></i>
                                            </div>
                                        </div>
                                    </a>
                                    <a href='https://www.menlo.one'>
                                        <div className="info-item">
                                            <div className="btn-icon"><img src={globe} alt="" width="29" height="29"/></div>
                                            <div className="btn-label">
                                                <span>Website <em>https://www.menlo.one</em></span>
                                                <i className="fa fa-angle-right"></i>
                                            </div>
                                        </div>
                                    </a>
                                    <div className="social-links" style={{ display: 'none' }}>
                                        <a  title="Twitter"><i className="fa fa-twitter"></i></a>
                                        <a  title="Facebook"><i className="fa fa-facebook"></i></a>
                                        <a  title="GitHub"><i className="fa fa-github"></i></a>
                                        <a  title="Hash"><i className="fa fa-slack"></i></a>
                                        <a  title="Flag"><i className="fa fa-paper-plane"></i></a>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default Profile
