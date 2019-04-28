import React, {Component} from 'react';
import {DataChart, DataType} from "./DataChart";
import {bool, object} from "prop-types";
import SystemMonitor from "./SystemMonitor";

class CpuChart extends Component {
	
	static propTypes = {
		data: object.isRequired,
		small: bool
	};
	
	
	constructor(props) {
		super(props);
		
		const nbCores = this.props.data[0].cpu.load.cpus.length;
		const colors = [];
		
		for (let i = 0; i < nbCores; i++) {
			colors.push(SystemMonitor.getRandomColor(2));
		}
		
		this.state = {
			nbCores: nbCores,
			colors: {
				cpuLoad: colors
			}
		}
		
		
	}
	
	
	render() {
		
		let smallClassName = (this.props.small) ? "small" : "";
		
		return (
			<div id="cpuCharts" className={"SystemComponent"}>
				
				<h1>CPU</h1>
				<h2>Load</h2>
				<div id="cpuLoad" className={smallClassName}>
					<DataChart type={DataType.cpu.load} data={this.props.data} label={"Frequency"}
					           colors={this.state.colors.cpuLoad}/>
				</div>
				<h2>Frequency</h2>
				
				
			</div>
		);
	}
}

export default (CpuChart);
