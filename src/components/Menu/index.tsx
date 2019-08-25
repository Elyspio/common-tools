import * as React from "react";
import {connect} from "react-redux";
import {Action} from "../../redux/Action";
import "./Menu.css"
import {PanelMenu} from "primereact/panelmenu";

type IProps = {
	mode: string,
	changeComponent(component: string): void
}

class Menu extends React.Component<IProps> {

	render() {
		let menu;
		if (this.props.mode === "primereact") {

			const items = [
				{
					label: "Fun",
					items: [
						{
							label: "Anime Renamer",
							command: () => this.props.changeComponent(Action.changeComponent.payload.fun.rename)
						},
						{
							label: "Fuel worker",
							command: () => this.props.changeComponent(Action.changeComponent.payload.fun.fuelWorker)
						},
						{
							label: "Stop apps",
							command: () => this.props.changeComponent(Action.changeComponent.payload.fun.stopApps)
						},
						{
							label: "System Monitor",
							command: () => this.props.changeComponent(Action.changeComponent.payload.fun.systemMonitor)
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
									command: () => this.props.changeComponent(Action.changeComponent.payload.dev.startServers)
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

const mapStateToProps = (state: Function) => {
	return {}
};

const mapDispatchToProps = (dispatch: Function) => {
	return {
		changeComponent: (component: string) => {
			dispatch({
				type: Action.changeComponent.type,
				payload: component
			})
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);


