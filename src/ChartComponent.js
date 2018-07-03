import React from 'react';
import { render } from 'react-dom';
import {Line} from 'react-chartjs-2';
import axios from 'axios';


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
    var keys = ['date','open','close','hight','low','volume'],
        i = 0, k = 0,
        obj = null,
        output = [];

    for (i = 0; i < data.length; i++) {
        obj = {};
        obj[keys[0]] = new Date(data[i][0]);
        for (k = 1; k < keys.length; k++) {
            obj[keys[k]] = parseInt(data[i][k]);
        }
        output.push(obj);
    }
    return output;
}

class ChartComponent extends React.Component {

  componentDidMount() {
    const promiseMSFT = axios.get(`${config.apiURL}/red/chart?symbol=${symbol ? symbol : 'ETHUSDT'}&interval=1w`, //`${config.apiURL}/newsletter`,
        {
            'Content-Type': 'application/json'
        }
    ).then(json => {
        const data = json.data.chart.data[0];
        return convertData(data);
    });
    console.log(promiseMSFT);
    this.setState({     cd:promiseMSFT});
  }
	render() {
		if (this.state == null) {
			return <div className='loading-chart'>Loading...</div>
		}
		return (
			<div className="charohlc">
				<Line data={this.state.cd} height={200} options={options} />
			</div>
		)
	}
}

export default ChartComponent;
