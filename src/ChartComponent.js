
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getTickerHistory } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";


class ChartComponent extends React.Component {
	componentDidMount() {
        getTickerHistory().then(data => {
			this.setState({ data })
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<div className="charohlc">
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
			</div>
		)
	}
}

export default ChartComponent;