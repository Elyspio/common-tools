import PropTypes from 'prop-types'
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {xml2js} from 'xml-js'
import '../assets/css/FuelFinder.css'

function mapStateToProps(state) {
	return {
		fuelSetting  : state.fuelSetting
	};
}

class FuelFinderOld extends Component {

	/**
	 *
	 * @description FUELS for all application including Redux
	 *
    **/
	static settings = {
		fuels: {
			gazole: {
				id: 1,
				nom: "Gazole"
			},
			sp95: {
				id: 2,
				nom: "SP95"
			},
			E85: {
				id: 3,
				nom: "E85"
			},
			gpl: {
				id: 4,
				nom: "GPLc"
			},
			e10: {
				id: 5,
				nom: "E10"
			},
			sp98: {
				id: 6,
				nom: "SP98"
			},
		},

		order: {
			asc: "asc",
			dsc: "dsc"
		},

		format: {
			json: "json",
			xml: "xml"
		}
	};


	constructor(props) {
		super(props);
		this.state = {
			url: "http://elyspio.fr:4000/now",
			settings: {
				fuel: FuelFinderOld.settings.fuels.gazole,
				order: FuelFinderOld.settings.order.asc,
				cp: 69300
			},
			pdv: [],
			params: {format: ""}
		}
	}

	/**
	 * @description Change data format (json | xml) and fetch data
	 * @param format : oneOf : "json" | "xml"
	 */
	setFormat = (format) => {
		this.setState(prev => {

				return {
					...prev,
					params: {
						...prev.params,
						format: format
					},

				}
			}, this.fetchData
		);


	}

	fetchData = () => {


		let format = this.state.params.format
		console.log("COUCOU2", format);
		if (format !== "") {

			fetch(this.urlWithParams(), {method: "GET"})
				.then(res => {
					if (this.state.params.format === FuelFinderOld.settings.format.json)
						res.json().then(json => {
							console.log(json);
							let pdvArr = json['pdv_liste']['pdv'];
							console.log(pdvArr[0], this.state.settings.cp.toString().slice(0, 2));

							pdvArr = pdvArr.filter(pvd => pvd['_attributes']['cp'].startsWith(this.state.settings.cp.toString().slice(0, 2)) && pvd['prix'] !== undefined)
							let searchedPvd = [];

							pdvArr.forEach(pvd => {
								if (pvd['prix'].length !== undefined) {
									pvd['prix'].forEach(p => {
										if (p['_attributes']['id'].toString() === this.state.settings.fuel.id.toString()) {
											// searchedPvd.push(<Row pdv={pvd} fuelId={this.state.settings.fuel.id}/>)


											searchedPvd.push(new Pvd({
												cp: pvd['_attributes']['cp'],
												price: p['_attributes']['valeur'],
												address: pvd['adresse']['_text']
											}))
										}
									});
								} else {
									if (pvd['_attributes']['id'].toString() === this.state.settings.fuel.id.toString()) {
										// console.log(pvd);
										// searchedPvd.push(<Row pdv={pvd} fuelId={this.state.settings.fuel.id}/>)
										searchedPvd.push(new Pvd({
											cp: pvd['_attributes']['cp'],
											price: pvd['prix']['_attributes']['valeur'],
											address: pvd['adresse']['_text']
										}))
									}
								}


							});

							console.log(searchedPvd);


							searchedPvd = searchedPvd.sort((pvdA, pvdB) => {
								console.log(pvdA, pvdB);
								return pvdA.price < pvdB.price? 1 : -1
							});
							//
							//
							this.setState(prev => {
								return {
									...prev,
									pdv: searchedPvd
								}
							}, () => console.log(this.state.pdv))


						});
					else if (format === FuelFinderOld.settings.format.xml) {
						res.text().then(xml => {

							console.log(xml2js(xml, {compact: true}));
						});
					}

				})
				.catch(e => {
					console.log(e);
				});
		}
	}


	render() {

		console.log("A", this.state.pdv);
		return (
			<div id={"fuelFinder"}>
				<h1>FUEL !</h1>
				<button onClick={() => this.setFormat(FuelFinderOld.settings.format.json)}>Fetch JSON</button>
				<button onClick={() => this.setFormat(FuelFinderOld.settings.format.xml)}>Fetch XML</button>

				<div className={""}>
					<div className={"row"}>
						<p>Marque</p>
						<p>CP</p>
						<p>Adresse</p>
						<p>Prix</p>
						<p>Distance</p>
					</div>

					<div className="table">
						{this.state.pdv.map(pdv => <PdvComp key={PdvComp.nbComp++} address={pdv.address} brand={pdv.brand} cp={pdv.cp}
						                                    dist={pdv.dist} price={pdv.price}/>)}
					</div>

				</div>


			</div>
		);
	}


	urlWithParams = () => {
		let url = this.state.url;
		const keys = Object.keys(this.state.params);
		for (let i = 0; i < keys.length; i++) {
			if (i === 0) {
				url += '?'
			}
			url += `${keys[i]}=${this.state.params[keys[i]]}`;
			if (i < keys.length - 1)
				url += '&'
		}
		console.log(url);
		return url;
	}
}


class Pvd {

	brand;
	cp;
	price;
	dist;
	address;

	constructor(props) {

		this.brand = "";
		this.cp = props.cp;
		this.price = props.price;
		this.dist = 0;
		this.address = props.address;

	}

};


class PdvComp extends React.Component {
	static nbComp = 0;

	static propTypes = {
		address: PropTypes.string.isRequired,
		brand: PropTypes.string.isRequired,
		cp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		dist: PropTypes.number.isRequired,
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

		};


	}


	render() {
		return (
			<div className="row">
				<p className={"brand"}>{this.state.brand}</p>
				<p className={"cp"}>{this.state.cp}</p>
				<p className={"address"}>{this.state.address}</p>
				<p className={"price"}>{this.state.price}</p>
				<p className={"dist"}>{this.state.dist}</p>
			</div>


		);
	}
}


export default connect(
	mapStateToProps,
)(FuelFinderOld);

export {
	FuelFinderOld
};



