import PropTypes from "prop-types";
import React from "react";

class Pvd {

	brand;
	cp;
	price;
	dist;
	address;
	city;

	constructor(props) {

		this.brand = "";
		this.cp = props.cp;
		this.price = props.price;
		this.dist = 0;
		this.address = props.address;
		this.city = props.city

	}

};


class PdvComp extends React.Component {
	static nbComp = 0;

	static propTypes = {
		address: PropTypes.string.isRequired,
		brand: PropTypes.string.isRequired,
		cp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		dist: PropTypes.number.isRequired,
		city : PropTypes.string.isRequired,
		price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
	}

	constructor(props) {
		super(props);
		this.state = {
			brand: props.brand,
			cp: props.cp,
			address: props.address,
			price: props.price,
			dist: props.dist,
			city : props.city

		};


	}


	render() {


		return (
			<div className="row">
				<p className={"brand"}>{this.state.brand}</p>
				<p className={"city"}>{this.state.city}</p>
				<p className={"address"}>{this.state.address}</p>
				<p className={"cp"}>{this.state.cp}</p>
				<p className={"price"}>{this.state.price}</p>
				<p className={"dist"}>{this.state.dist}</p>
			</div>


		);
	}
}


export {
	Pvd,
	PdvComp
}
