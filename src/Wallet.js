import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';
import './css/wallet.css';

class Wallet extends Component {
  render() {
    return (
    	<div>
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
