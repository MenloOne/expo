import React, { Component } from 'react';
import TopNav from './TopNav.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';
import './css/discover.css';

class Discover extends Component {
  render() {
    return (
    	<div>
    	<TopNav />
		<div className="content-wrapper ">
			<div className="row">
				<div className="col-md-3 discover-sidebar">
					<div className="container">
						
						<h3>Quick Picks</h3>
						<ul className="side-bar-nav">
							<li><a href="#">Upcoming ICOs</a></li>
							<li><a href="#">Trending</a></li>
							<li><a href="#">Recommended For You</a></li>
							<li><a href="#">Backed By Friends</a></li>
							<li><a href="#">Backed By Influencers</a></li>
							<li><a href="#">Everything</a></li>
						</ul>

						<h3>Token Categories</h3>
						<ul className="side-bar-nav">
							<li><a href="#">Security <span>(32)</span></a></li>
							<li><a href="#">Utility <span>(42)</span></a></li>
							<li><a href="#">Currency <span>(11)</span></a></li>
							<li><a href="#">Membership <span>(101)</span></a></li>
							<li><a href="#">Dividend <span>(57)</span></a></li>
							<li><a href="#">Other <span>(105)</span></a></li>
						</ul>

						<h3>Network</h3>
						<ul className="side-bar-nav">
							<li><a href="#">Ethereum <span>(2,834,332)</span></a></li>
							<li><a href="#">EOS <span>(4,473)</span></a></li>
							<li><a href="#">Steller <span>(938)</span></a></li>
							<li><a href="#">Hashgraph <span>(101)</span></a></li>
						</ul>

						<h3>Sale Stage</h3>
						<ul className="side-bar-nav">
							<li><a href="#">Main Sale <span>(734,112)</span></a></li>
							<li><a href="#">Pre Sale <span>(1,473)</span></a></li>
							<li><a href="#">Private <span>(3,834,384)</span></a></li>
							<li><a href="#">On Going <span>(4,101)</span></a></li>
						</ul>

						<h3>Structure</h3>
						<ul className="side-bar-nav">
							<li><a href="#">ICO <span>(2,834,384)</span></a></li>
							<li><a href="#">DAICO <span>(8,473)</span></a></li>
							<li><a href="#">Interactive <span>(636)</span></a></li>
							<li><a href="#">Follow On <span>(4,101)</span></a></li>
						</ul>
					</div>
				</div>
				<div className="col-md-9 discover-maincontent">
					<div className="container">
						<div className="header">
							<div className="row">
								<div className="col-md-6">
									<div className="main-card-header">
										<h2>Todays Gem Tokens</h2>
										<p>An algorithmic list of today's best tokens, based on
										your preferences and Guilds you're following.</p>
										<a className="card-cto">Let’s Go!</a>
									</div>
								</div>
								<div className="col-md-6">
									<div className="guid-top-title">
										<h2>Guilds Youʼre Following</h2>
										<a href="#" className="top-title-more">More guilds</a>
										<div className="clearfix"></div>
									</div>
									<ul className="guild-list">
										<li>
											<div className="item-im item-im-red"></div>
											<h4>Blockchain Architects Guild</h4>
											<p>The top blockchain architects in the world, reviewing ICOs for the lulz.</p>
										</li>
										<li>
											<div className="item-im item-im-yellow"></div>
											<h4>Token Economist</h4>
											<p>Authoratative insights and opinions on alt-coins.</p>
										</li>
										<li>
											<div className="item-im item-im-green"></div>
											<h4>Cypherpunx</h4>
											<p>Decentralize everything.</p>
										</li>
										<li>
											<div className="item-im item-im-red"></div>
											<h4>Exchanged</h4>
											<p>Leaders from the worldʼs top exchanges share their thoughts</p>
										</li>
									</ul>
									
								</div>
							</div>
						</div>

						<div className="main-content-networks">
									<div className="main-content-networks-title">
									<h2>Token Networks</h2>
									<ul className="nav-arrows">
										<li><a href="#" className="prev"><img src="images/discover/arrow-prev.png" /></a></li>
										<li><a href="#" className="next"><img src="images/discover/arrow-next.png" /></a></li>
									</ul>
									<div className="clearfix"></div>
									</div>
									<ul className="ex-networks">
										<li>
											<img className="shadow" src="images/discover/network-ex-eth.png" />
											<img className="bg" src="images/discover/network-ex-eth.png" />
											<div className="main-content-list">
												<h4>Ethereum</h4>
												<span className="trend-tag">TRENDING</span>
											</div>
										</li>
										<li>
											<img className="shadow" src="images/discover/network-ex-eos.png" />
											<img className="bg" src="images/discover/network-ex-eos.png" />
											<div className="main-content-list">
												<h4>EOS</h4>
												<span className="trend-tag">TRENDING</span>
											</div>
										</li>
										<li>
											<img className="shadow" src="images/discover/network-ex-hashgraph.png" />
											<img className="bg" src="images/discover/network-ex-hashgraph.png" />
											<div className="main-content-list">
												<h4>Hashgraph</h4>
												<span className="trend-tag">TRENDING</span>
											</div>
										</li>
									</ul>
							</div>
							

							<div className="featured-guilds-wrapper">
								<h2>Featured Guilds</h2>
								<ul className="featured-guilds-wrapper-list">
									<li>
										<div className="main-item-guild">
											<div className="item-im item-im-red"></div>
											<h4>Blockchain Architects Guild</h4>
											<p>The top blockchain architects in the
											world, reviewing ICOs for the lulz.</p>	
										</div>
										<div className="follow-foot">
											<span>492 reviews</span>
											<a href="#" className="follow-cto">+Follow</a>
											<div className="clearfix"></div>
										</div>
									</li>
									<li>
										<div className="main-item-guild">
											<div className="item-im item-im-red"></div>
											<h4>Blockchain Architects Guild</h4>
											<p>The top blockchain architects in the
											world, reviewing ICOs for the lulz.</p>	
										</div>
										<div className="follow-foot">
											<span>492 reviews</span>
											<a href="#" className="follow-cto">+Follow</a>
											<div className="clearfix"></div>
										</div>
									</li>
									<li>
										<div className="main-item-guild">
											<div className="item-im item-im-red"></div>
											<h4>Blockchain Architects Guild</h4>
											<p>The top blockchain architects in the
											world, reviewing ICOs for the lulz.</p>	
										</div>
										<div className="follow-foot">
											<span>492 reviews</span>
											<a href="#" className="follow-cto">+Follow</a>
											<div className="clearfix"></div>
										</div>
									</li>
								</ul>
							</div>

							<div className="main-list-wrapper">
								<ul className="top-panels-menu">
									<li><a href="#" className="active">Early Allocation</a></li>
									<li><a href="#">Active</a></li>
									<li><a href="#">On Going</a></li>
								</ul>
								<div className="main-input-items">
									<select className="sort-menu">
										<option>SORT BY: SALE STAGE</option>
									</select>
									<ul className="right-params">
										<li>
											<select className="mr-cap">
												<option>MARKET CAP</option>
											</select>									
										</li>
										<li>
											<select className="sel-cat">
												<option>CATEGORIES</option>
											</select>									
										</li>
										<li>
											<select className="hard-cap">
												<option>HARD CAP</option>
											</select>									
										</li>
										<li className="radio-sel">
											<input type="radio" name="acc-only" />
											<label htmlFor="acc-only">ACCREDITED ONLY</label>
										</li>
									</ul>
									<div className="clearfix"></div>
								</div>
								<div className="main-list-items">
									<div className="game-token shadow-sm">
										<a href='/profile/'>
									    <div className="container">
									        <span className="game-img"><img src="images/small-img.png" alt="" /></span>
												<div className="game-detail">
													<h2>BitKitties</h2>
													<p>A game where users win tokens for catching mice</p>
													<div className="tw">
														<span className="user-img"><img src="images/user-1.png" title="user" alt="user" /></span>
														<span className="user-img"><img src="images/user-2.png" title="user" alt="user" /></span>
														<span className="user-img"><img src="images/user-1.png" title="user" alt="user" /></span>
														<a href="#">6 friends</a> and 1,353 others committed to buying when sale opens
													</div>
												</div>
												<div className="btn-top-right">
													<a href="#" className="circle-btn" title=""><img src="images/icon.png" alt="" /></a>
													<a href="#" className="btn border-button" title="Watch">Allocated</a>
												</div>
											</div>
										</a>
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

export default Discover;
