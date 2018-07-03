import React from 'react';
import { render } from 'react-dom';
import {Line} from 'react-chartjs-2';
import axios from 'axios';
import config from './internals/config/private';
import { getTickerHistory } from "./utils"

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

componentDidMount() {
    getTickerHistory().then(data => {
            this.setState({     cd:{
            labels:['Open','High','Low','Close'],
            datasets:[
            {
                label:'Open time: '+new Date(data[0])+' Close time: '+new Date(data[6]),
                data:[parseInt(data[1]),parseInt(data[2]),parseInt(data[3]),parseInt(data[4])]
            }
            ]
        }})
        })
  }
	render() {
		if (this.state == null) {
			return <div className='loading-chart charted'>Loading...</div>
		}
		return (
			<div className="charohlc">
				<Line data={this.state.cd} height={200} options={options} />
			</div>
		)
	}
}

export default ChartComponent;
