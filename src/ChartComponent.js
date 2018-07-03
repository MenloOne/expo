import React from 'react';
import { render } from 'react-dom';
import {Line} from 'react-chartjs-2';


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

class ChartComponent extends React.Component {
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
		if (this.state == null) {
			return <div className='loading-chart'>Loading...</div>
		}
		return (
			<div className="charohlc">
				<Line data={this.state.cd} options={options} />
			</div>
		)
	}
}

export default ChartComponent;
