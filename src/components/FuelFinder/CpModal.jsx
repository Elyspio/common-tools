import React from "react";
import {InputText} from "primereact/inputtext";
import {Action} from "../../actions";
import '../../assets/css/FuelFinder/CpModal.css'
import {connect} from "react-redux";
import {Button} from "primereact/button";

class CpModal extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			cp: this.props.fuelSetting.cp
		}
	}
	
	changeValue = (e) => {
		e.persist();
		console.log(e.target.value);
		this.setState(prev => ({
			...prev,
			cp: e.target.value
		}))
	};
	
	
	render() {
		return (
			<div className={"cpModal"}>
				<InputText id="cpInput" placeholder={"xxxxx"} tooltip={"le département voulu"} value={this.state.cp}
				           onChange={e => this.changeValue(e)} onKeyUp={e => this.processEnter(e)}/>
				<Button label={"Valider"} onClick={() => this.props.changeCp(this.state.cp)}/>
			</div>
		);
	}
	
	processEnter = (e) => {
		if (e.key === 'Enter')
			this.props.changeCp(this.state.cp);
	};
	
	componentDidMount() {
		document.querySelector("#cpInput").focus();
	}
	
}

const mapStateToProps = (state) => {
	return {
		fuelSetting: state.fuelSetting
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		
		changeCp: (cp) => {
			dispatch({
				type: Action.FUEL_FINDER.CHANGE_CP.TYPE,
				payload: cp
			})
		},
	}
};


