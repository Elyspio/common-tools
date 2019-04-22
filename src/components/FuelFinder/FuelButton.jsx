import PropTypes from 'prop-types'
import React from 'react'
import {Action} from "../../redux/Action";
import {connect} from "react-redux";
import './FuelButton.css'

class FuelButton extends React.Component {
	
	static propTypes = {
		fuel: PropTypes.object.isRequired,
	};
	
	constructor(props) {
		super(props);
		this.state = {
			disabled: this.props.fuelSetting.fuel === props.fuel
		};
		
	}
	
	update = (newProps) => {
		
		this.setState({
			disabled: newProps.fuelSetting.fuel === this.props.fuel
		})
	};
	
	
	componentWillReceiveProps = (nextProps, nextContext) => {
		
		if (nextProps.fuelSetting !== this.props.fuelSetting)
			this.update(nextProps);
		
	};
	
	render() {
		
		
		return (
			<button className={"fuelButton"} onClick={() => this.props.changeFuel(this.props.fuel)}
			        disabled={this.state.disabled}>
				{this.props.fuel.nom}
			</button>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		changeFuel: (fuel) => {
			
			
			dispatch({
				type: Action.FUEL_FINDER.CHANGE_FUEL.TYPE,
				payload: fuel
			})
			
			
		},
	}
}

function mapStateToProps(state) {
	return {
		fuelSetting: state.fuelSetting
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FuelButton)
