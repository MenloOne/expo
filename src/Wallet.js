import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import ChartComponent from './ChartComponent.js';
import TopNav from './TopNav.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';
import './css/wallet.css';

const logo = require('./images/logo.jpg');
const userIm = require('./images/user-1.png');
const smallImroot = require('./images/small-img.png');

var dataOne = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ],
  datasets: [
    {
      label: "My Second dataset",
      backgroundColor: "rgba(255,0,0,0.1)",
      data: [5, 6.0, 12.5, 6.0, 8.5, 11.0, 11.0]
    }
  ]
}

const options = {
  responsive: true,
  title: {
    display: false
  },
  tooltips: {
    mode: 'label'
  },
  hover: {
    mode: 'dataset'
  },
  scales: {
    xAxes: [{
            gridLines: {
                // You can change the color, the dash effect, the main axe color, etc.
                borderDash: [8, 4],
                color: "#348632"
            }
        }],
    yAxes: [
      {
        display: false
      }
    ]
  }
}
class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
    	cd:{
    		labels:['One','Two','Three'],
    		type: "ohlc",
    		datasets:[
    		{
    			label:'Population',
    			data:[0.1,0.2,0.3]
    		}
    		]
    	},
    	datatwo:[]
    }
  }

  componentDidMount() {
    fetch("https://api.binance.com/api/v1/klines?symbol=ETHUSDT&interval=1w")
      .then(response => response.json())
      .then(dataResp => this.setState({    	cd:{
    		labels:['Open','High','Low','Close'],
    		datasets:[
    		{
    			label:'Population',
    			data:[parseInt(dataResp[0][1]),parseInt(dataResp[0][2]),parseInt(dataResp[0][3]),parseInt(dataResp[0][4])]
    		}
    		]
    	}}));
  }

  render() {
    return (
    	<div>
    	<TopNav />

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
		<div className="subChart">
			<h2>$11,662.82</h2>
			<ul className="subChartmenu">
				<li><a href="#">HOUR</a></li>
				<li><a href="#">DAY</a></li>
				<li><a href="#">WEEK</a></li>
				<li><a href="#">MONTH</a></li>
				<li><a href="#">YEAR</a></li>
				<li><a href="#">ALL</a></li>
			</ul>
			<div className="clearfix"></div>
		</div>
		<ChartComponent />
		<ul className="wallet-panels-menu">
		    <li><a href="#" className="active">Live</a></li>
		    <li><a href="#">Upcoming</a></li>
		</ul>
		<div className="wallet-main-panels">
		    <div className="container">
		        <div className="row">
		            <div className="col-md-4 item-wrapper">
		                <img src={smallImroot} className="item-thumbnail" />
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
		                    <p className="time">
		                    	<p className="timestep">
		                    		04:
		                    		<span className="timetag">
		                    			Days
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		12:
		                    		<span className="timetag">
		                    			Hours
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		09:
		                    		<span className="timetag">
		                    			Minutes
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		22
		                    		<span className="timetag">
		                    			Seconds
		                    		</span>
		                    	</p>
		                    </p>
		                </div>
		            </div>
		            <div className="col-md-4 item-wrapper">
		                <img src={smallImroot} className="item-thumbnail" />
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
		                    <p className="time">
		                    	<p className="timestep">
		                    		04:
		                    		<span className="timetag">
		                    			Days
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		12:
		                    		<span className="timetag">
		                    			Hours
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		09:
		                    		<span className="timetag">
		                    			Minutes
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		22
		                    		<span className="timetag">
		                    			Seconds
		                    		</span>
		                    	</p>
		                    </p>
		                </div>
		            </div>
		            <div className="col-md-4 item-wrapper">
		                <img src={smallImroot} className="item-thumbnail" />
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
		                    <p className="time">
		                    	<p className="timestep">
		                    		04:
		                    		<span className="timetag">
		                    			Days
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		12:
		                    		<span className="timetag">
		                    			Hours
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		09:
		                    		<span className="timetag">
		                    			Minutes
		                    		</span>
		                    	</p>
		                    	<p className="timestep">
		                    		22
		                    		<span className="timetag">
		                    			Seconds
		                    		</span>
		                    	</p>
		                    </p>
		                </div>
		            </div>
		        </div>
		    </div>
		</div>
		</div>
    );
  }
}

export default Wallet;
