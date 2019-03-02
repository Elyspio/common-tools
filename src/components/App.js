import React from 'react'
import {connect} from "react-redux";
import {Action} from "../redux/Action";
import ComponentMenu from "./ComponentMenu";
import Rename from "./Rename";
import StartServers from "./StartServers";

import '../assets/css/App.css'
import "../assets/css/blueprint.css"


import '../assets/import/theme.css'
import '../assets/import/primereact.min.css'
import '../assets/import/primeicons.css'

import FuelFinder from "./FuelFinder";


// nova dark stheme


class App extends React.Component {
	render() {

		let comp;
		switch (this.props.component.current) {
			case Action.CHANGE_COMPONENT.PAYLOAD.FUN.RENAME:
				comp = <Rename/>;
				break;

			case Action.CHANGE_COMPONENT.PAYLOAD.FUN.FUEL_WORKER:
				comp = <FuelFinder/>
				break;

			case Action.CHANGE_COMPONENT.PAYLOAD.DEV.START_SERVERS:
				comp = <StartServers/>;
				break;


			default:
				break;
		}

		return (
			<div id={"App"}>
				<div id="menu" className={"components"}>
					<ComponentMenu mode={"primereact"} />

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
