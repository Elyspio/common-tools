import React, {Component} from 'react';
import {connect} from "react-redux";
import CanvasJsReact from '../../lib/canvasJs/canvasjs.react';

// const canvasJsReact = require("../../lib/canvasJs/canvasjs.react")

const CanvasJsChart = CanvasJsReact.CanvasJSChart;

let si = require("systeminformation");

si = window.require("systeminformation");

function mapStateToProps(state) {
	
	return {};
}

function mapDispatchToProps(dispatch)
{
	return {};
}


class DataArray {
	
	data;
	limit;
	
	constructor(limit) {
		this.limit = limit;
		this.data = [];
	}
	
	push(data) {
		
		if (this.data.length >= this.limit) {
			this.data.shift();
		}
		this.data.push({
			...data,
			time : Date.now()
		});
		
		return this
		
	}
	
	getData = () => this.data;
	
	clearData = () => this.data.clear();
	
}


class SystemMonitor extends Component
{
	
	static REFRESH_SPEED_MODIFIER = {
		VERY_LOW: 4,
		LOW: 2,
		MEDIUM: 1,
		HIGH: 0.5,
		HIGHEST: 0.25,
		MAX: 0.2
	};
	static PRINT_TIME = true;
	static LOW_REFRESH_RATE = 1e4;
	static HIGH_REFRESH_RATE = 1e3;
	static NEVER_REFRESH_RATE = Infinity;
	currentSpeedModifier = SystemMonitor.REFRESH_SPEED_MODIFIER.MEDIUM;
	
	constructor(props) {
		super(props);
		const self = this;
		this.state = {
			
			highFrequencyArray: new DataArray(100),
			lowFrequencyArray: new DataArray(10),
			neverFrequencyData: {}
			
		};
		
		this.getDynamicData(SystemMonitor.NEVER_REFRESH_RATE).then(neverRefreshData => {
			this.getDynamicData(SystemMonitor.LOW_REFRESH_RATE).then(lowRefreshData => {
				
				console.log(lowRefreshData);
				
				this.getDynamicData(SystemMonitor.HIGH_REFRESH_RATE, lowRefreshData.network).then(highRefreshData => {
					
					const lowFrequencyData = {
						gpu: lowRefreshData.gpu,
						battery: lowRefreshData.battery,
						network: lowRefreshData.network,
					};
					
					const highFrequencyData = {
						cpu: {
							speed: highRefreshData.cpuSpeed,
							temp: highRefreshData.cpuTemp,
						},
						disk: highRefreshData.disk,
						memory: highRefreshData.memory,
						network: highRefreshData.network,
					};
					
					const neverFrequencyData = {
						info: neverRefreshData.cpuInfo,
						system: neverRefreshData.system
					};
					
					
					console.debug(neverFrequencyData);
					
					this.setState(prev => {
						return {
							lowFrequencyArray : prev.lowFrequencyArray.push(lowFrequencyData),
							highFrequencyArray : prev.highFrequencyArray.push(highFrequencyData),
							neverFrequencyData : neverFrequencyData
						}
				
						
					}, () => {
						console.log("Constructor State : ", this.state);
						self.initRefresh();
					});
				});
			});
		});
		
	}
	
	componentWillUnmount() {
		clearInterval();
	}
	
	initRefresh() {
		setInterval(() => {
			this.getDynamicData(SystemMonitor.LOW_REFRESH_RATE).then(data => {
				const {gpu, battery, network} = data;
				this.setState(prev => {
					console.debug(prev.lowFrequencyArray);
					const lowFrequencyData = prev.lowFrequencyArray.push({
						gpu: gpu,
						battery: battery,
						network: network
					});
					
					
					
					return {
						...prev,
						lowFrequencyArray: lowFrequencyData
					}
				}, () => {
					console.log("Low refresh : ", this.state);
				})
			})
		}, (SystemMonitor.LOW_REFRESH_RATE * this.currentSpeedModifier) | 0);
		
		
		setInterval(() => {
			this.getDynamicData(SystemMonitor.HIGH_REFRESH_RATE).then(data => {
				const {cpuSpeed, cpuTemp, memory, network, disk} = data;
				this.setState(prev => {
					
					const highFrequencyArray = prev.highFrequencyArray.push({
						cpu: {
							...prev.cpu,
							speed: cpuSpeed,
							temp: cpuTemp
						},
						disk: disk,
						network: network,
						memory: memory
					});
					
					return {
						...prev,
						highFrequencyArray: highFrequencyArray,
					}
				}, () => {
					console.log("High refresh : ", this.state);
				})
			})
			
		}, (SystemMonitor.HIGH_REFRESH_RATE * this.currentSpeedModifier) | 0)
	}
	
	async getDynamicData(frequency, obj) {
		
		if (frequency === SystemMonitor.HIGH_REFRESH_RATE)
		{
			if (obj === undefined || obj === null) {
				obj = this.state.lowFrequencyArray.getData()
			}
			
			
			if (SystemMonitor.PRINT_TIME) {
				
				console.time("SystemMonitor.HIGH_REFRESH_RATE");
				
				console.time("cpuSpeed");
				let cpuSpeed = await si.cpuCurrentspeed();
				console.timeEnd("cpuSpeed");
				
				console.time("cpuTemp");
				let cpuTemp = await si.cpuTemperature();
				console.timeEnd("cpuTemp");
				
				console.time("memory");
				let memory = await si.mem();
				console.timeEnd("memory");
				
				console.time("disk");
				let disk = await si.fsSize();
				console.timeEnd("disk");
				
				console.time("network");
				let network = obj;
				for (let i = 0; i < obj.length; i++) {
					si.networkStats(obj[i]['iface']).then(stats => {
						delete stats['0']['iface'];
						obj[i]['stats'] = stats['0'];
					});
				}
				console.timeEnd("network");
				console.timeEnd("SystemMonitor.HIGH_REFRESH_RATE");
				
				return {
					cpuSpeed: cpuSpeed,
					cpuTemp: cpuTemp,
					memory: memory,
					disk: disk,
					network: network
					
				}
				
			} else {
				
				
				for (let i = 0; i < obj.length; i++) {
					si.networkStats(obj[i]['iface']).then(stats => {
						delete stats['0']['iface'];
						obj[i]['stats'] = stats['0'];
					});
				}
				
				return {
					cpuSpeed: await si.cpuCurrentspeed(),
					cpuTemp: await si.cpuTemperature(),
					memory: await si.mem(),
					disk: await si.fsSize(),
					network: obj
					
				}
			}
		}
		
		if (frequency === SystemMonitor.LOW_REFRESH_RATE) {
			
			if (SystemMonitor.PRINT_TIME) {
				
				console.time("battery");
				let battery = await si.battery();
				console.timeEnd("battery");
				
				console.time("gpu");
				let gpu = await si.graphics();
				console.timeEnd("gpu");
				
				console.time("network");
				let network = await si.networkInterfaces();
				console.timeEnd("network");
				
				return {
					battery: battery,
					gpu: gpu,
					network: network
				}
				
			}
			
			
			return {
				battery: await si.battery(),
				gpu: await si.graphics(),
				network: await si.networkInterfaces(),
				
			}
		}
		
		
		if (frequency === SystemMonitor.NEVER_REFRESH_RATE) {
			
			if (SystemMonitor.PRINT_TIME) {
				
				console.time("cpuInfo");
				let cpuInfo = await si.cpu();
				console.timeEnd("cpuInfo");
				
				console.time("system");
				let system = await si.system();
				console.timeEnd("system");
				
				return {
					cpuInfo: cpuInfo,
					system: system,
				}
			}
			
			return {
				cpuInfo: await si.cpu(),
				system: await si.system()
			}
		}
		
	}
	
	render()
	{
		
		const options = {
			title: {
				text: "Basic Column Chart in React"
			},
			data: [{
				type: "column",
				dataPoints: [
					{label: "Apple", y: 10},
					{label: "Orange", y: 15},
					{label: "Banana", y: 25},
					{label: "Mango", y: 30},
					{label: "Grape", y: 28}
				]
			}]
		};
		
		return (
			<div id={"SystemMonitor"}>
				<CanvasJsChart options={options}/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemMonitor);
