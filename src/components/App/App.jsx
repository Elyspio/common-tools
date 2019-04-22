import React from 'react'
import {connect} from "react-redux";
import {Action} from "../../redux/Action";

import './App.css'

// import "../assets/css/blueprint.css"


// import '../assets/import/theme.css'

import "primereact/resources/themes/nova-dark/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"

import FuelFinder from "../FuelFinder/FuelFinder";
import StopApps from "../StopApps/StopApps";
import StartServers from "../StartServer/StartServers";
import Menu from "../Menu/Menu";
import Rename from "../Rename/Rename";
import SystemMonitor from "../SystemMonitor/SystemMonitor";



// nova dark stheme


class App extends React.Component {
	render() {

		let comp;
		switch (this.props.component.current) {
			case Action.CHANGE_COMPONENT.PAYLOAD.FUN.RENAME:
				comp = <Rename/>;
				break;

			case Action.CHANGE_COMPONENT.PAYLOAD.FUN.FUEL_WORKER:
				comp = <FuelFinder/>;
				break;

			case Action.CHANGE_COMPONENT.PAYLOAD.DEV.START_SERVERS:
				comp = <StartServers/>;
				break;

			case Action.CHANGE_COMPONENT.PAYLOAD.FUN.STOP_APPS:
				comp = <StopApps/>;
				break;
				
				
			case Action.CHANGE_COMPONENT.PAYLOAD.FUN.SYSTEM_MONITOR:
				comp = <SystemMonitor/>;
			default:
				break;
		}

		return (
			<div id={"App"}>
				<div id="menu" className={"components"}>
					<Menu mode={"primereact"} />

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
