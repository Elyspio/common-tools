import React, {Component} from 'react';
import {connect} from "react-redux";
import {DataArray} from "./DataArray";
import {DataChart, DataType} from "./DataChart";

let si = require("systeminformation");

si = window.require("systeminformation");

function mapStateToProps(state) {
	
	return {};
}

function mapDispatchToProps(dispatch)
{
	return {};
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
	static PRINT_TIME = false;
	static LOW_REFRESH_RATE = 1e4;
	static HIGH_REFRESH_RATE = 1e3;
	static NEVER_REFRESH_RATE = Infinity;
	currentSpeedModifier = SystemMonitor.REFRESH_SPEED_MODIFIER.HIGH;
	
	chartRef = null;
	
	COLORS = {
		cpu: []
		
	};
	
	constructor(props) {
		super(props);
		
		// defaults.global = {
		// 	...defaults.global,
		// 	animation : false
		// }
		
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
							frequency: highRefreshData.cpuFrequency,
							temp: highRefreshData.cpuTemp,
							load: highRefreshData.cpuLoad
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
							lowFrequencyArray: prev.lowFrequencyArray.push(lowFrequencyData),
							highFrequencyArray: prev.highFrequencyArray.push(highFrequencyData),
							neverFrequencyData: neverFrequencyData
						}
						
						
					}, () => {
						console.log("Constructor State : ", this.state);
						
						for (let i = 0; i < this.state.neverFrequencyData.info.cores; i++) {
							this.COLORS.cpu[i] = SystemMonitor.getRandomColor();
						}
						
						
						self.initRefresh();
					});
				});
			});
		});
		
	}
	
	static getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	componentDidMount() {
		console.log(this.chartRef);
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
				const {cpuFrequency, cpuTemp, memory, network, disk, cpuLoad} = data;
				this.setState(prev => {
					
					const highFrequencyArray = prev.highFrequencyArray.push({
						cpu: {
							...prev.cpu,
							frequency: cpuFrequency,
							load: cpuLoad,
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
				
				console.time("cpuFrequency");
				let cpuLoad = await si.currentLoad();
				console.timeEnd("cpuFrequency");
				
				
				console.time("cpuFrequency");
				let cpuFrequency = await si.cpuCurrentspeed();
				console.timeEnd("cpuFrequency");
				
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
					cpuFrequency: cpuFrequency,
					cpuTemp: cpuTemp,
					cpuLoad: cpuLoad,
					memory: memory,
					disk: disk,
					network: network,
					
				}
				
			} else {
				
				
				for (let i = 0; i < obj.length; i++) {
					si.networkStats(obj[i]['iface']).then(stats => {
						delete stats['0']['iface'];
						obj[i]['stats'] = stats['0'];
					});
				}
				
				return {
					cpuFrequency: await si.cpuCurrentspeed(),
					cpuTemp: await si.cpuTemperature(),
					cpuLoad: await si.currentLoad(),
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
	
	render() {
		
		console.log(this.COLORS);
		
		const cpuFrequencyData = {
			labels: [],
			datasets: [{
				label: "",
				data: []
			}],
		};
		
		const cpuLoadData = {
			labels: [],
			datasets: [{
				label: "",
				data: [],
			}]
		}
		
		
		const highFrequencyData = this.state.highFrequencyArray.getData();
		console.log(highFrequencyData);
		
		
		// High Frequency Labels
		for (let i = 0; i < highFrequencyData.length; i++) {
			
			const date = new Date(highFrequencyData[i].time);
			
			const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			cpuFrequencyData.labels.push(time);
			cpuLoadData.labels.push(time);
			
		}
		
		
		const DETAIL_CPU_FREQUENCY = false;
		const DETAIL_CPU_LOAD = true;
		if (highFrequencyData.length > 0) {
			
			const nbCores = this.state.neverFrequencyData.info.cores;
			
			
			if (DETAIL_CPU_FREQUENCY) {
				
				for (let i = 0; i < nbCores; i++) {
					
					cpuFrequencyData.datasets[i] = {
						label: `proc : ${i}`,
						borderColor: this.COLORS.cpu[i],
						data: [],
						backgroundColor: "#00000000"
					};
					
					
					for (let j = 0; j < highFrequencyData.length; j++) {
						cpuFrequencyData.datasets[i].data[j] = highFrequencyData[j].cpu.frequency.cores[i];
					}
					
				}
			} else {
				
				
				cpuFrequencyData.datasets[0] = {
					label: "average",
					borderColor: "#ffffff",
					data: [],
					
				};
				
				
				for (let i = 0; i < highFrequencyData.length; i++) {
					
					let sum = 0;
					highFrequencyData[i].cpu.frequency.cores.forEach(speed => sum += speed);
					cpuFrequencyData.datasets[0].data[i] = sum / highFrequencyData[i].cpu.frequency.cores.length
				}
				
			}
			
			
			if (DETAIL_CPU_LOAD) {
				for (let i = 0; i < nbCores; i++) {
					
					cpuLoadData.datasets[i] = {
						label: `proc : ${i}`,
						borderColor: this.COLORS.cpu[i],
						data: [],
						backgroundColor: "#00000000"
					};
					
					
					for (let j = 0; j < highFrequencyData.length; j++) {
						console.debug(cpuLoadData.datasets[i], highFrequencyData[j].cpu.load)
						cpuLoadData.datasets[i].data[j] = highFrequencyData[j].cpu.load.cpus[i];
					}
					
				}
			} else {
				
				
				cpuLoadData.datasets[0] = {
					label: "average",
					borderColor: "#ffffff",
					data: [],
					
				};
				
				
				for (let i = 0; i < highFrequencyData.length; i++) {
					
					let sum = 0;
					highFrequencyData[i].cpu.load.cores.forEach(speed => sum += speed);
					cpuLoadData.datasets[0].data[i] = sum / highFrequencyData[i].cpu.load.cores.length
				}
				
			}
			
		}
		
		
		// for (let i = 0; i < highFrequencyData.length; i++) {
		//
		// 	const {frequency, temp} = highFrequencyData[i].cpu;
		// 	const speedCores = frequency.cores;
		//
		// 	const nbCores = speedCores.length;
		// 	for (let j = 0; j < nbCores; j++) {
		// 		cpuFrequencyData.datasets[j] = {};
		// 		cpuFrequencyData.datasets[j].label = `processor ${i}`;
		//
		// 	}
		//
		// 	console.log(i);
		// }
		
		const cpuLoad = <DataChart type={DataType.cpu.load} data={highFrequencyData} label={"Frequency"}/>;
		
		
		return (
			<div id={"SystemMonitor"}>
				{/*<Line data={cpuFrequencyData} options={options} ref={(ref) => this.chartRef = ref}/>*/}
				{cpuLoad}
			
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemMonitor);
