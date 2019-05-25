import PropTypes from 'prop-types'
import React from "react";
import {connect} from "react-redux";
import {Action} from "../../redux/Action";
import {PanelMenu} from "primereact/panelmenu.js";
import "./Menu.css"

class Menu extends React.Component {
	render() {
		let menu;
		
		if (this.props.mode === "primereact") {
			
			const items = [
				{
					label: "Fun",
					items: [
						{
							label: "Anime Renamer",
							command: () => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.FUN.RENAME)
						},
						{
							label: "Fuel worker",
							command: () => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.FUN.FUEL_WORKER)
						},
						{
							label: "Stop apps",
							command: () => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.FUN.STOP_APPS)
						},
						{
							label: "System Monitor",
							command: () => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.FUN.SYSTEM_MONITOR)
						}
					]
				},
				{
					label: "Dev",
					items: [
						{
							label: "Web",
							items: [
								
								{
									
									label: "Servers Stater",
									command: () => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.DEV.START_SERVERS)
								}
							]
						}
					]
				}
			];
			
			menu = <PanelMenu model={items}/>
		}
		
		return (
			<div id={"componentMenu"}>
				{menu}
			</div>
		);
		
		
	}
}

const mapStateToProps = (state) => {
	return {}
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeComponent: (component) => {
			dispatch({
				type: Action.CHANGE_COMPONENT.TYPE,
				payload: component
			})
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

Menu.propTypes = {
	mode: PropTypes.string.isRequired
};
