import React, {Component} from "react";
import {object, string} from "prop-types";
import {Line} from "react-chartjs-2";


const DataType = {
	cpu: {
		load: "CPU_LOAD",
		frequency: "CPU_FREQUENCY",
		temp: "CPU_TEMP"
	},
	
	mem: "MEMORY",
	disk: "DISK"
	
};

class DataChart extends Component {
	
	
	static options = {
		animation: false,
		scales: {
			yAxes: [{
				ticks: {
					min: 0,
					max: 5,
					stepSize: 0.5
				}
			}]
		}
		
		
	};
	// todo render(type)
	static propTypes = {
		type: object.isRequired,
		data: object.isRequired,
		label: string.isRequired,
		
	};
	
	constructor(props, context) {
		super(props, context);
		
	}
	
	
	render() {
		
		const charts = [];
		
		switch (this.props.type) {
			case DataType.cpu.load:
				
				const data = {
					labels : [],
					datasets : []
				}
				
				charts.push(<Line data={data} options={DataChart.options}/>);
				
				
				break;
		
			case DataType.cpu.frequency:
				break;
				
			default:
				console.error("Unrecognized dataChart Type");
				break;
		}
		
		
		return (
			<div className={"dataChart"}>
				{charts}
			</div>
		);
	}
}

export {
	DataChart,
	DataType
};
