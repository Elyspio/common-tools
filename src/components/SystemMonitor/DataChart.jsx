import React, {Component} from "react";
import {array, string} from "prop-types";
import {Line} from "react-chartjs-2";
import "./DataChart.css"

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
		
		maintainAspectRatio: false,
		scales: {
			yAxes: [{
				ticks: {
					min: 0,
					max: 100,
					stepSize: 25
				}
			}]
		},
		// legend: {
		// 	display : false,
		// 	labels : {
		// 		fontsize : 0
		// 	}
		// },
		tooltips: {
			callbacks: {
				label: function (tooltipItem) {
					return tooltipItem.yLabel;
				}
			}
		}
		
		
	};
	// todo render(type)
	static propTypes = {
		type: string.isRequired,
		data: array.isRequired,
		label: string.isRequired,
		colors: array.isRequired
		
	};
	chartRef;
	
	constructor(props, context) {
		super(props, context);
		
	}
	
	render() {
		
		const charts = [];
		
		
		switch (this.props.type) {
			case DataType.cpu.load:
				
				const cpus = this.props.data[0].cpu.load.cpus;
				const nbCores = cpus.length;
				
				let currentData;
				
				for (let cpuInd = 0; cpuInd < nbCores; cpuInd++) {
					
					
					currentData = {
						labels: [],
						datasets: [{
							label: `Proc ${cpuInd}`,
							data: [],
							borderColor: this.props.colors[cpuInd]
						}]
					};
					
					
					for (let timeInd = 0; timeInd < this.props.data.length; timeInd++) {
						const date = new Date(this.props.data[timeInd].time);
						
						// currentData.labels[timeInd] = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
						
						currentData.labels[timeInd] = "";
						
						const load = Math.round(this.props.data[timeInd].cpu.load.cpus[cpuInd].load * 100) / 100;
						currentData.datasets[0].data[timeInd] = load;
					}
					
					
					charts.push(
						<div className={"cpuLoadChart"}>
							<Line ref={ref => this.chartRef = ref} data={currentData} options={DataChart.options}/>
						</div>
					);
					
				}
				
				
				break;
			
			case DataType.cpu.frequency:
				break;
			
			default:
				console.error("Unrecognized dataChart Type");
				break;
		}
		
		
		return charts;
	}
}

export {
	DataChart,
	DataType
};
