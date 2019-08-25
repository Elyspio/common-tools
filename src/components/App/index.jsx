import React from 'react'
import {connect} from "react-redux";
import {Action} from "../../redux/Action";

import './App.css'

import "primereact/resources/themes/nova-dark/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"

import FuelFinder from "../FuelFinder/";
import StopApps from "../StopApps/";
import StartServers from "../StartServer/";
import Menu from "../Menu/"
import Rename from "../Rename/";
import SystemMonitor from "../SystemMonitor";


class App extends React.Component {
	render() {
		
		let comp;
		switch (this.props.component.current) {
			case Action.changeComponent.payload.fun.rename:
				comp = <Rename/>;
				break;
			
			case Action.changeComponent.payload.fun.fuelWorker:
				comp = <FuelFinder/>;
				break;
			
			case Action.changeComponent.payload.dev.startServers:
				comp = <StartServers/>;
				break;
			
			case Action.changeComponent.payload.fun.stopApps:
				comp = <StopApps/>;
				break;
			
			
			case Action.changeComponent.payload.fun.systemMonitor:
				comp = <SystemMonitor/>;
				break;
			default:
				break;
		}
		
		return (
			<div id={"App"}>
				<div id="menu" className={"components"}>
					<Menu mode={"primereact"}/>
				
				</div>
				
				<div id={"currentComponent"} className={"components"}>
					{comp}
				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		component: state.component
	}
};

const mapDispatchToProps = (dispatch) => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
