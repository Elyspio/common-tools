import React, {Component} from 'react';
import {connect} from "react-redux";
import {DataArray} from "./DataArray";
import {Dropdown} from "primereact/dropdown";
import CpuChart from "./CpuChart";
import {Action} from "../../redux/Action";
import './SystemMonitor.css'


let si = require("systeminformation");

si = window.require("systeminformation");

function mapStateToProps(state) {
	
	return {
		systemMonitor : state.systemMonitor
	};
}

function mapDispatchToProps(dispatch)
{
	return {};
}


class SystemMonitor extends Component
{
	

	static PRINT_TIME = false;
	static LOW_REFRESH_RATE = 10e3;
	static HIGH_REFRESH_RATE = 1e3;
	static NEVER_REFRESH_RATE = Infinity;
	
	static nbRefresh = 0;
	
	intervalIds = [];
	
	
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
			
			
			highFrequencyArray: new DataArray(20),
			lowFrequencyArray: new DataArray(20),
			neverFrequencyData: {},
			
			dimensions: {}
			
		};
		
		
		this.getDynamicData(SystemMonitor.NEVER_REFRESH_RATE).then(neverRefreshData => {
			this.getDynamicData(SystemMonitor.LOW_REFRESH_RATE).then(lowRefreshData => {
				
				//console.log(lowRefreshData);
				
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
					
					this.setState(prev => {
						return {
							lowFrequencyArray: prev.lowFrequencyArray.push(lowFrequencyData),
							highFrequencyArray: prev.highFrequencyArray.push(highFrequencyData),
							neverFrequencyData: neverFrequencyData,
							currentSpeedModifier : this.props.systemMonitor.speedModifier
						}
						
						
					}, () => {
						//console.log("Constructor State : ", this.state);
						
						for (let i = 0; i < this.state.neverFrequencyData.info.cores; i++) {
							this.COLORS.cpu[i] = SystemMonitor.getRandomColor();
						}
						this.updateRefreshSpeed(this.state.currentSpeedModifier);
						
						
					});
				});
			});
		});
		
	}
	
	static getRandomColor(min) {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * (16 - min)) + min];
		}
		return color;
	}
	
	updateRefreshSpeed(speedModifier) {
		
		console.debug("Change SpeedModifier", speedModifier);
		
		this.setState(prev => {
			return {
				...prev,
				currentSpeedModifier: speedModifier,
				lowRefreshSpeed: Math.floor(SystemMonitor.LOW_REFRESH_RATE * speedModifier),
				highRefreshSpeed: Math.floor(SystemMonitor.HIGH_REFRESH_RATE * speedModifier),
			}
		}, () => {
			this.intervalIds.forEach(id => clearTimeout(id));
			this.initRefresh();
		});
	}
	
	// new componentWillRecieveProps
	static getDerivedStateFromProps(props, state) {
		if(state.currentSpeedModifier !== props.systemMonitor.speedModifier)
		{
			
			console.log("Nouveau props", props.systemMonitor);
			
			return {
				...state,
				currentSpeedModifier : props.systemMonitor.speedModifier
			}
		}
		return null;
	}
	
	
	componentDidMount() {
		
		const comp = document.querySelector("div#Index");
		window.addEventListener("resize", () => {
			this.setState({
				dimensions: {
					width: comp.clientWidth,
					height: comp.clientHeight,
				},
			});
		});
		
		comp.addEventListener("click", evt => {
			console.log(evt);
		});
		
		
	}
	
	
	componentWillUnmount() {
		this.intervalIds.forEach(id => clearTimeout(id));
	}
	
	initRefresh() {
		
		const self = this;
		
		this.queryLowRefreshedData(self);
		
		this.queryHighRefreshedData(self);
		
	}
	
	queryHighRefreshedData(self) {
		self.getDynamicData(SystemMonitor.HIGH_REFRESH_RATE).then(data => {
			const {cpuFrequency, cpuTemp, memory, network, disk, cpuLoad} = data;
			return this.setState(prev => {
				
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
				//console.log("High refresh : ", this.state);
			})
		})
			.finally(() => {
				SystemMonitor.nbRefresh += 1;
				self.intervalIds.push(setTimeout(() => self.queryHighRefreshedData(self), self.state.highRefreshSpeed))
				//console.log("nbRefresh : ", Index.nbRefresh);
			})
	}
	
	queryLowRefreshedData(self) {
		self.getDynamicData(SystemMonitor.LOW_REFRESH_RATE).then(data => {
			const {gpu, battery, network} = data;
			return this.setState(prev => {
				//console.debug(prev.lowFrequencyArray);
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
				//console.log("Low refresh : ", this.state);
			})
		}).finally(() => {
			//console.log("HERE", self.state.lowRefreshSpeed);
			self.intervalIds.push(setTimeout(() => self.queryLowRefreshedData(self), self.state.lowRefreshSpeed));
			SystemMonitor.nbRefresh += 1;
			//console.log("nbRefresh : ", Index.nbRefresh);
			
		})
	}
	
	async getDynamicData(frequency, obj) {
		
		if (frequency === SystemMonitor.HIGH_REFRESH_RATE)
		{
			if (obj === undefined || obj === null) {
				obj = this.state.lowFrequencyArray.getData()
			}
			
			
			if (SystemMonitor.PRINT_TIME) {
				
				//console.time("Index.HIGH_REFRESH_RATE");
				
				//console.time("cpuFrequency");
				let cpuLoad = await si.currentLoad();
				//console.timeEnd("cpuFrequency");
				
				
				//console.time("cpuFrequency");
				let cpuFrequency = await si.cpuCurrentspeed();
				//console.timeEnd("cpuFrequency");
				
				//console.time("cpuTemp");
				let cpuTemp = await si.cpuTemperature();
				//console.timeEnd("cpuTemp");
				
				//console.time("memory");
				let memory = await si.mem();
				//console.timeEnd("memory");
				
				//console.time("disk");
				let disk = await si.fsSize();
				//console.timeEnd("disk");
				
				//console.time("network");
				let network = obj;
				for (let i = 0; i < obj.length; i++) {
					si.networkStats(obj[i]['iface']).then(stats => {
						delete stats['0']['iface'];
						obj[i]['stats'] = stats['0'];
					});
				}
				//console.timeEnd("network");
				//console.timeEnd("Index.HIGH_REFRESH_RATE");
				
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
				
				//console.time("battery");
				let battery = await si.battery();
				//console.timeEnd("battery");
				
				//console.time("gpu");
				let gpu = await si.graphics();
				//console.timeEnd("gpu");
				
				//console.time("network");
				let network = await si.networkInterfaces();
				//console.timeEnd("network");
				
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
				
				//console.time("cpuInfo");
				let cpuInfo = await si.cpu();
				//console.timeEnd("cpuInfo");
				
				//console.time("system");
				let system = await si.system();
				//console.timeEnd("system");
				
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
		};
		
		
		const highFrequencyData = this.state.highFrequencyArray.getData();
		
		
		// High Frequency Labels
		for (let i = 0; i < highFrequencyData.length; i++) {
			
			const date = new Date(highFrequencyData[i].time);
			
			const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			cpuFrequencyData.labels.push(time);
			cpuLoadData.labels.push(time);
			
		}
		
		//console.log("State render : " , this.state);
		
		if (highFrequencyData.length > 0) {
			
			let isSmallScreen = (this.state.dimensions.width < 800);
			
			const options = [
				{label: "Lower", value: Action.systemMonitor.changeSpeed.payload.lower},
				{label: "Low", value: Action.systemMonitor.changeSpeed.payload.low},
				{label: "Normal", value: Action.systemMonitor.changeSpeed.payload.normal},
				{label: "High", value: Action.systemMonitor.changeSpeed.payload.high},
				{label: "Highest", value: Action.systemMonitor.changeSpeed.payload.highest},
				{label: "Max", value: Action.systemMonitor.changeSpeed.payload.max}
			];
			
			return (
				<div id={"Index"} >
			
					
					<CpuChart data={highFrequencyData} small={isSmallScreen}/>
					
					<Dropdown value={this.state.currentSpeedModifier} options={options}
					          onChange={e => this.updateRefreshSpeed(e.value)}/>
					
				</div>
			);
		} else {
			return (
				<div id={"Index"}>
					Wait please
				</div>
			)
		}
		
		
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemMonitor);
