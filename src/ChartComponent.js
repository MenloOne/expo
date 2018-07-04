import React from 'react';
import { render } from 'react-dom';
import {Line} from 'react-chartjs-2';
import axios from 'axios';
import config from './internals/config/private';
import { getTickerHistory } from "./utils"
var format = require('date-format');


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
    maintainAspectRatio: false,
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

function convertData(data) {
    var obj = {}
    return obj;
}

class ChartComponent extends React.Component {

    state = {
        cd:{
            labels: ['-', '-'],
            datasets:[
                {
                    label:'Loading...',
                    data: [0,0]
                }
            ]
        }
    }

    getLabels(data) {
        var i = 0
        return data.map(d => {

            if (i++ % 2 == 0) {
                return ''
            }

            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit'
            }).format(d[0])
        })
    }

    getClose(data) {
        return data.map(d => d[4])
    }

    componentDidMount() {
        getTickerHistory().then(chart => {
            this.setState({
                cd:{
                    labels: this.getLabels(chart.data),
                    datasets:[
                        {
                            label:'Last 6 months',
                            data: this.getClose(chart.data)
                        }
                    ]
                }})
        })
    }
    render() {
        return (
            <div className="charohlc">
                <Line data={this.state.cd} height={200} options={options} />
            </div>
        )
    }
}

export default ChartComponent;
