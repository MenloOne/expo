

import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		return d;
	};
}
function convertData(data) {
      var keys = ["date","open","close","hight","low","volume"],
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
const parseDate = timeParse("%Y-%m-%d");

export function getData() {
	const promiseMSFT = fetch("https://api.binance.com/api/v1/klines?symbol=ETHUSDT&interval=1w")
		.then(response => response.json())
		.then(data => convertData(data));
	return promiseMSFT;
}
