import React, {Component} from 'react'
import TopNav from './TopNav.js'
import ReviewBoard from './ReviewBoard'
import CountdownTimer from './CountdownTimer'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/sb-admin.css'

const screenshot = require('./images/screenshot.png')
const userIm = require('./images/user-1.png')
const user2Im = require('./images/user-2.png')
const iconIm = require('./images/icon.png')
const smallImroot = require('./images/small-img.png')
const whitePaperIm = require('./images/white-paper.png')

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
    const tokens = Math.round((eth * 347 * 1.3) * 100) / 100
    this.setState({eth: eth, tokens: tokens})
  }

  onEditTokens(evt) {
    let tokens = evt.target.value
    let eth = Math.round((tokens / (347 * 1.3)) * 100) / 100
    this.setState({eth: eth, tokens: tokens})
  }

  render() {
    return (
      <div>
        <TopNav/>

        <div className="recommended-for-you">
          <div className="container">
            <span className="user-img"><img src={userIm} title="user" alt="user"/></span>Recommended for you
            by <a href="#">@Jason</a>
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
                                                <span className="user-img"><img src={userIm} title="user"
                                                                                alt="user"/></span>
                        <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
                        <span className="user-img"><img src={userIm} title="user"
                                                        alt="user"/></span>
                      </div>
                      <div className="top-names"><a href="#">@david</a>, <a href="#">@jenny</a>,
                        and <a href="#">@bobNYC</a></div>
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
                      <div className="top-names"><a href="#">@BlockchainCapital</a>, <a
                        href="#">@RogerVer</a> and 1,322 others
                      </div>
                    </div>

                  </div>

                  <hr/>

                  <h2>About BITKITTIES</h2>
                  <p>Collect and trade BitKitties in one of the world's first blockchain games. Breed
                    your rarest kitties to create the top mice catcher. Live
                    long and prospurr.</p>

                  <img className='screenshot' src={screenshot} width="100%" height="441px"/>

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
                    <span className="user-img"><img src={user2Im} title="user" alt="user"/></span>
                    <div className="user-detail">
                      <div className="team-member-name"><a href="#">@greatthings</a></div>
                      <div className="designation">COO</div>
                    </div>
                  </div>
                </div>


                <div className="reviews-and-comments expert-reviews left-side">
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
                <ReviewBoard/>

              </div>

              <div className="col-md-4">
                <div className="right-side-box">

                  <div className="green-bg">
                    <div className="start-in">STARTS IN</div>
                    <CountdownTimer date={new Date().addDays(120)}/>
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
                        <div className="name-token">Menlo Token (ONE)</div>
                        <div className="tex-field">
                          <input type="text" value={this.state.eth}
                                 onChange={this.onEditEth}/>
                          <span>ETH</span>
                        </div>
                        <div className="offer">Approx. $391.20</div>
                      </div>
                      <div className="arrow"></div>
                      <div className="bitkitties">
                        <div className="name-token">BitKitties (BTK)</div>
                        <div className="tex-field">
                          <input type="text" value={this.state.tokens}
                                 onChange={this.onEditTokens}/>
                          <span>BTK</span>
                        </div>
                        <div className="offer">Including 30% discount</div>
                      </div>
                    </div>
                    <a href="#" className="green-btn" title="Get Allocation">Get Allocation</a>
                    <p>Your Menlo wallet will auto-buy BTK at a 30% discount when sale opens June
                      26.</p>
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
                  <div className="info-item"><img src={whitePaperIm} alt="" width="36" height="31"/>
                    <span>White Paper</span> <i
                      className="fa fa-angle-right"></i>
                  </div>
                  <div className="info-item"><img src="images/globe.png" alt="" width="29"
                                                  height="29"/>
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
                        <img className="d-flex mr-3  " src="images/also-1.png" alt=""/>
                        <div className="media-body">
                          <a href="#">LiveTree ADEPT</a>
                          <div className="text-muted smaller">Car insurance that charges you
                            only when you’re behind the wheel.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="list-group-item list-group-item-action">
                      <div className="media">
                        <img className="d-flex mr-3  " src="images/also-2.png" alt=""/>
                        <div className="media-body">
                          <a href="#">Halo</a>
                          <div className="text-muted smaller">A community for photographers
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="list-group-item list-group-item-action">
                      <div className="media">
                        <img className="d-flex mr-3  " src="images/also-3.png" alt=""/>

                        <div className="media-body">
                          <a href="#">Let’s Go</a>
                          <div className="text-muted smaller">Foursquare on the blockchain
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
      </div>
    )
  }
}

export default Profile
