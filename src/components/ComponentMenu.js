import PropTypes from 'prop-types'
import React from "react";
import {Classes, Menu} from "@blueprintjs/core";
import {connect} from "react-redux";
import {Action} from "../redux/Action";
import {PanelMenu} from "primereact/panelmenu";
import "../assets/css/ComponentMenu.css"

class ComponentMenu extends React.Component {
	render() {
		let menu;

		if (this.props.mode === "blueprint") {
			menu =
				<Menu className={Classes.ELEVATION_1}>
					<Menu.Item text={"Animes"}>
						<Menu.Item text={"Renamer"}
						           onClick={() => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.FUN.RENAME)}/>
					</Menu.Item>

					<Menu.Item text={"Web"}>
						<Menu.Item text={"Start Servers"}
						           onClick={() => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.DEV.START_SERVERS)}/>
					</Menu.Item>

				</Menu>;
		}

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
							label : "Fuel worker",
							command : () => this.props.changeComponent(Action.CHANGE_COMPONENT.PAYLOAD.FUN.FUEL_WORKER)
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentMenu);

ComponentMenu.propTypes = {
	mode: PropTypes.string.isRequired
}
