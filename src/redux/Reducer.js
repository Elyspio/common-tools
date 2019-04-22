import {Action} from './Action';
import {FuelFinder} from "../components/FuelFinder/FuelFinder";

const DEFAULT_STATE = {
	COMPONENT: {
		current: Action.CHANGE_COMPONENT.NONE
	},
	FUEL: {
		fuel: FuelFinder.settings.fuels.gazole,
		sortBy: FuelFinder.settings.sortBy.price,
		order: FuelFinder.settings.order.asc,
		format: FuelFinder.settings.format.json,
		cp: "69300"
	},

};


const componentReducer = (state = DEFAULT_STATE.COMPONENT, action) => {

	switch (action.type) {
		case Action.CHANGE_COMPONENT.TYPE:
			state = {
				...state,
				current: action.payload
			};
			break;

		default:
			break;
	}


	return state;
};

const fuelReducer = (state = DEFAULT_STATE.FUEL, action) => {
	console.log(action.type, Action.FUEL_FINDER.CHANGE_SORTER.TYPE, action.payload);
	switch (action.type) {

		case Action.FUEL_FINDER.CHANGE_FUEL.TYPE:
			state = {
				...state,
				fuel: action.payload
			};
			break;

		case Action.FUEL_FINDER.CHANGE_CP.TYPE :
			state = {
				...state,
				cp: action.payload
			};
			break;

		case Action.FUEL_FINDER.CHANGE_FORMAT.TYPE :
			state = {
				...state,
				format: action.payload
			};
			break;

		case Action.FUEL_FINDER.REORDER.TYPE :
			state = {
				...state,
				order: action.payload
			};
			break;


		case Action.FUEL_FINDER.CHANGE_SORTER.TYPE :
			console.log("CHANGE SORTER !!! ");
			state = {
				...state,
				sortBy : action.payload
			};
			break;

		default:
			break;
	}


	return state;
};


export {
	DEFAULT_STATE,
	componentReducer,
	fuelReducer
}
