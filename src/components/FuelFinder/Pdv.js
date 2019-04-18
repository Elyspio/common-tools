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
		this.address = this.removeSpecialChars(props.address);
		this.city = this.removeSpecialChars(props.city);

	}

	removeSpecialChars = (input) => {

		if(input === undefined)
			return "Inconnu ";

		let splices = input.toLocaleLowerCase().replace(new RegExp("[-_]", "g"), " ").split(" ");
		let output = ""
		for (let i = 0; i < splices.length; i++) {
			if (splices[i].length > 3) {
				output += `${splices[i][0].toUpperCase()}${splices[i].slice(1)} `;
			}
		}

		return output;
	}

};


class PdvComp extends React.Component {
	static nbComp = 0;

	static propTypes = {
		address: PropTypes.string.isRequired,
		brand: PropTypes.string.isRequired,
		cp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		dist: PropTypes.number.isRequired,
		city: PropTypes.string.isRequired,
		price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
	}

	constructor(props) {
		super(props);
		this.state = {
			brand: props.brand,
			address: props.address,
			city: props.city,
			cp: props.cp,
			price: props.price,
			dist: props.dist,

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
