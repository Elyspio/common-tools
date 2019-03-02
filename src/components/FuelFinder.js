import PropTypes from 'prop-types'
import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../assets/css/FuelFinder.css'
import {Action} from "../redux/Action";
import Axios from 'axios'
import {ProgressBar} from "@blueprintjs/core";

function mapStateToProps(state) {
	return {
		fuelSetting: state.fuelSetting
	};
}

function mapDispatchToProps(dispatch) {
	return {
		changeFuel: (fuel) => {

			console.log("baka", fuel);

			dispatch({
				type: Action.FUEL_FINDER.CHANGE_FUEL.TYPE,
				payload: fuel
			})
		},

		changeCp: (cp) => {
			dispatch({
				type: Action.FUEL_FINDER.CHANGE_CP.TYPE,
				payload: cp
			})
		},

		changeFormat: (format) => {
			dispatch({
				type: Action.FUEL_FINDER.CHANGE_FORMAT.TYPE,
				payload: format
			})
		},


		reorder: (order) => {
			dispatch({
				type: Action.FUEL_FINDER.REORDER.TYPE,
				payload: order,
			})
		},


	}
}


class FuelFinder extends Component {

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
		},
		sortBy: {
			price: "price",
			cp: "cp",
			brand: "brand",
			dist: "distance"
		}
	};


	constructor(props) {
		super(props);
		this.state = {
			url: "http://elyspio.fr:4000/year/2017",
			pdv: [],
			allPdv: [],
			fetchProgress : 0
		}

		this.onlyOneFetcher(this.update);

	}

	componentWillReceiveProps(nextProps, nextContext) {
		console.log("NEW PROPS", nextProps)

		this.update(nextProps);

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
			}, () => this.onlyOneFetcher(this.update)
		);


	}

	onlyOneFetcher = (callback) => {

		Axios.get(this.urlWithParams(), {
			onDownloadProgress: (p) => {

				this.setState({
					fetchProgress : p.loaded / p.total
				})
			},
			responseType: 'json'
		}).then(data => {
			if (this.props.fuelSetting.format === FuelFinder.settings.format.json) {
				const json = data['data'];
				console.log(json);
				this.setState(prev => ({
					...prev,
					allPdv: json['pdv_liste']['pdv']
				}), callback)
			}
		})

	};


	sort = (pdvs) => {

		const sortBy = (field) => {
			switch (this.props.fuelSetting.order) {
				case FuelFinder.settings.order.asc:
					pdvs = pdvs.sort((pvdA, pvdB) => {
						return pvdA[field] > pvdB[field] ? 1 : -1
					});
					break;

				case FuelFinder.settings.order.dsc:
					pdvs = pdvs.sort((pvdA, pvdB) => {
						return pvdA[field] < pvdB[field] ? 1 : -1
					});
					break;

				default:
					break;


			}
		};
		switch (this.props.fuelSetting.sortBy) {

			case FuelFinder.settings.sortBy.price:
				sortBy("price");
				break;

			case FuelFinder.settings.sortBy.brand :
				sortBy("brand");
				break;

			case FuelFinder.settings.sortBy.cp :
				sortBy("cp");
				break;


			case FuelFinder.settings.sortBy.dist:
				sortBy("dist");
				break

		}

		this.setState(prev => ({
			...prev,
			pdv: pdvs
		}));

	}


	update = (props = this.props) => {
		const searchedPdv = [];

		console.log("TAILLE", this.state.allPdv.length);


		const cpPdv = this.state.allPdv.filter(pvd => pvd['_attributes']['cp'].startsWith(props.fuelSetting.cp.toString().slice(0, 2)) && pvd['prix'] !== undefined);

		console.log("TAILLE CP", cpPdv.length);


		cpPdv.forEach(pdv => {

			if (pdv['prix'].length !== undefined) {
				pdv['prix'].forEach(p => {
					if (p['_attributes']['id'].toString() === props.fuelSetting.fuel.id.toString()) {
						// searchedPdv.push(<Row pdv={pvd} fuelId={this.state.settings.fuel.id}/>)


						searchedPdv.push(new Pvd({
							cp: pdv['_attributes']['cp'],
							price: p['_attributes']['valeur'],
							address: pdv['adresse']['_text']
						}))
					}
				});
			} else {
				if (pdv['_attributes']['id'].toString() === props.fuelSetting.fuel.id.toString()) {
					searchedPdv.push(new Pvd({
						cp: pdv['_attributes']['cp'],
						price: pdv['prix']['_attributes']['valeur'],
						address: pdv['adresse']['_text']
					}))
				}
			}
		});
		console.log("TAILLE Searched", searchedPdv.length);

		this.sort(searchedPdv);

	};


	renderBtns = () => {

		const btns = [];

		Object.keys(FuelFinder.settings.fuels).forEach(f => {
			btns.push(<button
				onClick={() => this.props.changeFuel(FuelFinder.settings.fuels[f])}>{FuelFinder.settings.fuels[f].nom}</button>)
		});

		return (
			<div className="btns">
				{btns}
			</div>
		)

	};

	renderTitles = () => {
		return (
			<div className={"row header"}>
				<p className={"brand"}>Marque</p>
				<p className={"cp"}>CP</p>
				<p className={"address"}>Adresse</p>
				<p className={"price"}>Prix</p>
				<p className={"dist"}>Distance</p>
			</div>
		)
	};


	render() {


		console.log("A", this.state.pdv);

		if(this.state.pdv.length !== [].length)
		{
			return (
				<div id={"fuelFinder"}>
					<h1>FUEL !</h1>

					<button onClick={() => this.setFormat(FuelFinder.settings.format.json)}>Fetch JSON</button>
					<button onClick={() => this.setFormat(FuelFinder.settings.format.xml)}>Fetch XML</button>
					{this.renderBtns()}

					<div className={""}>

						{this.renderTitles()}

						<div className="table">
							{this.state.pdv.map(pdv => <PdvComp key={PdvComp.nbComp++} address={pdv.address}
							                                    brand={pdv.brand} cp={pdv.cp}
							                                    dist={pdv.dist} price={pdv.price}/>)}
						</div>

					</div>

				</div>
			);
		}
		else {
			return (
				<div id={"fuelFinder"}>
					<h1>FUEL !</h1>
					<div className="progress">
						<h2>Téléchargement : </h2>
						<ProgressBar className={"progressBar"} intent={"danger"} value={this.state.fetchProgress} animate={true}/>
					</div>


				</div>
			);
		}



	}


	urlWithParams = () => {
		let url = this.state.url;

		let obj = {
			format: this.props.fuelSetting.format
		}

		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			if (i === 0) {
				url += '?'
			}
			url += `${keys[i]}=${obj[keys[i]]}`;
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


export default connect(mapStateToProps, mapDispatchToProps)(FuelFinder);

export {
	FuelFinder
};



