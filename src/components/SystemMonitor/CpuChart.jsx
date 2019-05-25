import React, {Component} from 'react';
import PropTypes from "prop-types";
import SystemMonitor from "./index";
import {Doughnut, Line} from "react-chartjs-2";
// Disable animating charts by default.
import './CpuChart.css'

// defaults.global.animation = false;

class CpuChart extends Component {
	
	static propTypes = {
		data: PropTypes.array.isRequired,
		small: PropTypes.bool
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
				cpuLoad: colors,
				system: '#333333',
				user: '#00ff9a'
			},
			isPartExtended: {
				load: true
			},
			useMultipleData: {
				load: false
			}
			
			
		}
		
		
	}
	
	
	togglePart = (part) => {
		
		console.log("Changing colaspe on " + part);
		
		this.setState(prev => {
			return {
				...prev,
				isPartExtended: {
					[part]: !prev.isPartExtended[part]
				}
				
				
			}
		}, () => console.log(this.props, this.state))
	};
	
	/**
	 * @description Create load charts from the last data
	 * @returns {Array<Node>}
	 */
	cpuLoadCharts = () => {
		
		const cpusCharts = [];
		
		const [data, length] = [this.props.data, this.props.data.length];
		
		
		if (this.state.useMultipleData.load) {
		
		} else {
			const cpusData = data[length - 1].cpu.load.cpus;
			
			let chartData = {
				labels: ['System', 'User', 'Free'],
				datasets: [
					{
						backgroundColor: [
							this.state.colors.system,
							this.state.colors.user,
							'#00000000'
						],
						
					}
				]
			};
			
			cpusData.forEach((cpu, index) => {
				chartData = {
					...chartData,
					datasets: [
						{
							...chartData.datasets[0],
							data: [
								cpu.load_system.toFixed(2),
								cpu.load_user.toFixed(2),
								(100 - cpu.load).toFixed(2)
							],
							
						}
					]
				};
				cpusCharts.push(<div><p className={"procName"}>{index + 1}</p>
					<Doughnut data={chartData}
					          options={{
						          legend: false,
						          responsive: true,
						          maintainAspectRatio: true,
						
					          }}/>
				</div>)
			})
			
			
		}
		
		const avgData = {
			labels: [],
			datasets: [
				{
					label: "System",
					backgroundColor: this.state.colors.system,
					data: [],
				},
				{
					label: "User",
					backgroundColor: this.state.colors.user,
					data: []
				}
			
			]
		};
		
		
		console.log(this.props.data);
		this.props.data.forEach(data => {
			avgData.labels.push(data.time);
			avgData.datasets[0].data.push(data.cpu.load.currentload_system);
			avgData.datasets[1].data.push(data.cpu.load.currentload_user);
		});
		
		const avgChart = <Line data={avgData} options={{
			responsive: true,
			maintainAspectRatio: true,
			scales: {
				xAxes: [{display: false,}],
				yAxes: [{ticks: {min: 0, max: 100, stepSize: 10}}],
			},
			animation: false
			
			
			// legend: false
		}}/>;
		
		return (
			<div id="cpuLoad">
				<h2 onClick={() => this.togglePart("load")}>Load</h2>
				
				<div className="average">
					{avgChart}
				</div>
				Core per core
				<div className="detail">
					{cpusCharts}
				
				</div>
			
			</div>
		);
		
	};
	
	
	
	render() {
		
		let smallClassName = (this.props.small) ? "small" : "";
		
		
		let cpuLoadDiv;
		
		
		return (
			<div id="cpuCharts" className={"SystemComponent"}>
				
				<h1>CPU</h1>
				{this.cpuLoadCharts()}
			
			</div>
		);
	}
}

export default (CpuChart);
