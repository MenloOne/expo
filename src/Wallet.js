import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import ChartComponent from './ChartComponent.js';
import TopNav from './TopNav.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';
import './css/wallet.css';
import CountdownTimer from "./CountdownTimer";

const logo = require('./images/logo.jpg');
const userIm = require('./images/user-1.png');
const smallImroot = require('./images/small-img.png');
const smallImroot2 = require('./images/small-img2.png');
const smallImroot3 = require('./images/small-img3.png');

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
            datasets:[
            {
                label:'Data',
                data:[0.1,0.2,0.3]
            }
            ]
        },
        datatwo:[]
    }
  }

  componentDidMount() {
    fetch("${config.apiURL}/red/chart?symbol=${symbol ? symbol : 'ETHUSDT'}&interval=1w")
      .then(response => response.json())
      .then(dataResp => this.setState({     cd:{
            labels:['Open','High','Low','Close'],
            datasets:[
            {
                label:'Data',
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
                    <div className='chart-title'>Portfolio Value</div>
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
                <Line data={this.state.cd} options={options} />
                {/*<ChartComponent />*/}
                <ul className="wallet-panels-menu">
                    <li><a href="#" className="active">Live</a></li>
                    <li><a href="#">Upcoming</a></li>
                </ul>
                <div className="wallet-main-panels">
                    <div className="container">
                        <div className="row justify-content-md-center">
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
                                    <CountdownTimer date={ new Date(2018, 7, 1, 7) }/>
                                    <p className="wrapper-foot-title title-to-left">TRADE THE MOMENT IT GOES LIVE</p>
                                    <ul className="btn-sec">
                                        <li><a href="#" className="blue-btn">ETHERDELTA</a></li>
                                        <li><a href="#" className="blue-btn">AIRSWAP</a></li>
                                    </ul>

                                    <ul className="trade-r-now-items">
                                        <li>
                                            <p className="wrapper-foot-title title-to-left">TRADE RIGHT NOW</p>
                                            <p className="foot-sub-title">FOMO OFFERS (7)</p>
                                        </li>
                                        <li>
                                            <p className="wrapper-foot-title title-to-left">PROFIT</p>
                                            <p className="foot-sub-title">23%</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4 item-wrapper">
                                <img src={smallImroot2} className="item-thumbnail" />
                                <h3>AutoChain</h3>
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
                                    <CountdownTimer date={ new Date(2018, 8, 5, 2 + 7) }/>

                                    <p className="wrapper-foot-title title-to-left">TRADE THE MOMENT IT GOES LIVE</p>
                                    <ul className="btn-sec">
                                        <li><a href="#" className="blue-btn">ETHERDELTA</a></li>
                                        <li><a href="#" className="blue-btn">AIRSWAP</a></li>
                                    </ul>

                                    <ul className="trade-r-now-items">
                                        <li>
                                            <p className="wrapper-foot-title title-to-left">TRADE RIGHT NOW</p>
                                            <p className="foot-sub-title">FOMO OFFERS (7)</p>
                                        </li>
                                        <li>
                                            <p className="wrapper-foot-title title-to-left">PROFIT</p>
                                            <p className="foot-sub-title">23%</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4 item-wrapper">
                                <img src={smallImroot3} className="item-thumbnail" />
                                <h3>GamerCoin</h3>
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
                                    <CountdownTimer date={ new Date(2018, 9, 1, 2 + 7) }/>

                                    <p className="wrapper-foot-title title-to-left">TRADE THE MOMENT IT GOES LIVE</p>
                                    <ul className="btn-sec">
                                        <li><a href="#" className="blue-btn">ETHERDELTA</a></li>
                                        <li><a href="#" className="blue-btn">AIRSWAP</a></li>
                                    </ul>

                                    <ul className="trade-r-now-items">
                                        <li>
                                            <p className="wrapper-foot-title title-to-left">TRADE RIGHT NOW</p>
                                            <p className="foot-sub-title">FOMO OFFERS (7)</p>
                                        </li>
                                        <li>
                                            <p className="wrapper-foot-title title-to-left">PROFIT</p>
                                            <p className="foot-sub-title">23%</p>
                                        </li>
                                    </ul>
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
