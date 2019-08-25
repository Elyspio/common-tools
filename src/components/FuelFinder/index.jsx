import React, {Component} from 'react';
import {connect} from 'react-redux';
import './FuelFinder.css'
import {Action} from "../../redux/Action";
import Axios from 'axios'
import {PdvComp, Pvd} from "./Pdv";
import FuelButton from "./FuelButton";
import FuelHeader from "./FuelHeader";

function mapStateToProps(state) {
	return {
		fuelSetting: state.fuelSetting
	};
}

function mapDispatchToProps(dispatch) {
	return {
		// changeFuel: (fuel) => {
		//
		// 	console.log("baka", fuel);
		//
		// 	dispatch({
		// 		type: Action.FUEL_FINDER.CHANGE_FUEL.type,
		// 		payload: fuel
		// 	})
		// },
		
		
		changeFormat: (format) => {
			dispatch({
				type: Action.FUEL_FINDER.CHANGE_FORMAT.TYPE,
				payload: format
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
			dist: "distance",
			address: "address",
			city: "city"
		}
	};
	
	
	constructor(props) {
		super(props);
		this.state = {
			url: "http://elyspio.fr:4000/now" +
				"",
			pdv: [],
			allPdv: [],
			fetchProgress: 0
		};
		
		this.onlyOneFetcher(this.update);
		
	}
	
	componentWillReceiveProps(nextProps, nextContext) {
		console.log("NEW PROPS", nextProps);
		
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
		
		
	};
	
	onlyOneFetcher = (callback) => {
		
		Axios.get(this.urlWithParams(), {
			onDownloadProgress: (p) => {
				
				this.setState({
					fetchProgress: p.loaded / p.total
				})
			},
			responseType: 'json'
		}).then(data => {
			if (this.props.fuelSetting.format === FuelFinder.settings.format.json) {
				const json = data['data'];
				this.setState(prev => ({
					...prev,
					allPdv: json['pdv_liste']['pdv']
				}), callback(this.props.fuelSetting))
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
						
						return pvdA[field] > pvdB[field] ? -1 : 1
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
			
			
			case FuelFinder.settings.sortBy.city:
				sortBy("city");
				break;
			
			case FuelFinder.settings.sortBy.address:
				sortBy("address");
				break;
			
			case FuelFinder.settings.sortBy.dist:
				sortBy("dist");
				break
			
		}
		
		this.setState(prev => ({
			...prev,
			pdv: pdvs
		}));
		
	};
	
	
	update = (props = this.props) => {
		const searchedPdv = [];
		
		console.log("TAILLE", this.state.allPdv, console.log(props.cp.length));
		
		
		let cpPdv;
		
		switch (props.fuelSetting.cp.length) {
			// No departement => all france
			case 0:
				cpPdv = this.state.allPdv.filter(pdv => pdv['prix'] !== undefined);
				break;
			
			// Only the departement : 69 : Rhone
			case 5:
				cpPdv = this.state.allPdv.filter(pvd => pvd['_attributes']['cp'] === props.fuelSetting.cp.toString() && pvd['prix'] !== undefined);
				break;
			
			// A city : 69300 : Caluire-et-Cuire
			default:
				cpPdv = this.state.allPdv.filter(pvd => pvd['_attributes']['cp']
					.startsWith(props.fuelSetting.cp.toString()
						.splice(0, Number(props.fuelSetting.cp))) && pvd['prix'] !== undefined);
				break
		}
		
		
		console.log("TAILLE CP", cpPdv.length);
		for (let i = 0; i < cpPdv.length; i++) {
			if (cpPdv[i]['prix'] === undefined) {
				console.log(cpPdv[i]);
				
			}
			
		}
		
		cpPdv.forEach(pdv => {
			
			
			if (pdv['prix'].length !== undefined) {
				pdv['prix'].forEach(p => {
					if (p['_attributes']['id'].toString() === props.fuelSetting.fuel.id.toString()) {
						searchedPdv.push(new Pvd({
							cp: pdv['_attributes']['cp'],
							city: pdv['ville']['_text'],
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
						city: pdv['ville']['_text'],
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
		let btn;
		Object.keys(FuelFinder.settings.fuels).forEach(f => {
			
			const fuel = FuelFinder.settings.fuels[f];
			
			btn = <FuelButton fuel={fuel}/>;
			
			btns.push(btn);
		});
		
		return (
			<div className="fuels">
				{btns}
			</div>
		)
		
	};
	
	
	renderTitles = () => {
		
		
		const sortBy = FuelFinder.settings.sortBy;
		return (
			<div className={"row header"}>
				<FuelHeader className={"brand"} sorter={sortBy.brand}>Marque</FuelHeader>
				<FuelHeader className={"city"} sorter={sortBy.city}>Ville</FuelHeader>
				<FuelHeader className={"address"} sorter={sortBy.address}>Adresse</FuelHeader>
				<FuelHeader className={"cp"} sorter={sortBy.cp}>Code Postale</FuelHeader>
				<FuelHeader className={"price"} sorter={sortBy.price}>Prix</FuelHeader>
				<FuelHeader className={"dist"} sorter={sortBy.dist}>Distance</FuelHeader>
			
			</div>
		)
	};
	
	
	render() {
		
		if (this.state.allPdv.length !== [].length) {
			return (
				<div id={"fuelFinder"}>
					<h1>FUEL !</h1>
					<div id={"cpChange"}>
						<p>Recherche : </p>
						{/*<Popover content={<CpModal changeCp={this.props.changeCp}/>}*/}
						{/*         target={<Button intent={"secondary"} text={this.props.fuelSetting.cp}/>}/>*/}
					
					</div>
					
					{/*<button onClick={() => this.setFormat(FuelFinder.settings.format.json)}>Fetch JSON</button>*/}
					{/*<button onClick={() => this.setFormat(FuelFinder.settings.format.xml)}>Fetch XML</button>*/}
					{this.renderBtns()}
					
					<div className={"table"}>
						
						{this.renderTitles()}
						
						<div className="data">
							{this.state.pdv.map(pdv => <PdvComp key={PdvComp.nbComp++} address={pdv.address}
							                                    brand={pdv.brand} cp={pdv.cp}
							                                    dist={pdv.dist} price={pdv.price} city={pdv.city}/>)}
						</div>
					
					</div>
					
					<button onClick={() => console.log(this.props.fuelSetting)}>Fuel Setting</button>
				
				</div>
			);
		} else {
			return (
				<div id={"fuelFinder"}>
					<h1>FUEL !</h1>
					<div className="progress">
						<h2>Téléchargement : </h2>
						{/*<ProgressBar className={"progressBar"} intent={"danger"} value={this.state.fetchProgress}*/}
						{/*             animate={true}/>*/}
					</div>
				
				
				</div>
			);
		}
		
		
	}
	
	
	urlWithParams = () => {
		let url = this.state.url;
		
		let obj = {
			format: this.props.fuelSetting.format
		};
		
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			if (i === 0) {
				url += '?'
			}
			url += `${keys[i]}=${obj[keys[i]]}`;
			if (i < keys.length - 1)
				url += '&'
		}
		return url;
	}
	
	
}


export default connect(mapStateToProps, mapDispatchToProps)(FuelFinder);

export {
	FuelFinder
};



