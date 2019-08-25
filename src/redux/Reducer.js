import {Action} from './Action';
import {FuelFinder} from "../components/FuelFinder";

const DEFAULT_STATE = {
	COMPONENT: {
		current: Action.changeComponent.payload.NONE
	},
	FUEL: {
		fuel: FuelFinder.settings.fuels.gazole,
		sortBy: FuelFinder.settings.sortBy.price,
		order: FuelFinder.settings.order.asc,
		format: FuelFinder.settings.format.json,
		cp: "69300"
	},
	SYSTEM_MONITOR: {
		speedModifier: Action.systemMonitor.changeSpeed.payload.normal,
	}
	
};


const systemMonitorReducer = (state = DEFAULT_STATE.SYSTEM_MONITOR, action) => {
	
	const {HIGH, HIGHEST, LOW, LOWER, MAX, MIN, NORMAL} = Action.systemMonitor.changeSpeed.payload;
	
	if([HIGH, HIGHEST, LOW, LOWER, MAX, MIN, NORMAL].findIndex(x => x === action.payload) >= 0) {
		state = {
			...state,
			speedModifier: action.payload,
		};
	
	}
	

	
	return state;
};


const componentReducer = (state = DEFAULT_STATE.COMPONENT, action) => {
	
	switch (action.type) {
		case Action.changeComponent.type:
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
	console.log(action.type, Action.fuelFinder.changeSorter.type, action.payload);
	switch (action.type) {
		
		case Action.fuelFinder.changeFuel.type:
			state = {
				...state,
				fuel: action.payload
			};
			break;
		
		case Action.fuelFinder.changeCp.type :
			state = {
				...state,
				cp: action.payload
			};
			break;
		
		case Action.fuelFinder.changeFormat.type :
			state = {
				...state,
				format: action.payload
			};
			break;
		
		case Action.fuelFinder.reorder.type :
			state = {
				...state,
				order: action.payload
			};
			break;
		
		
		case  Action.fuelFinder.changeSorter.type :
			console.log("CHANGE SORTER !!! ");
			state = {
				...state,
				sortBy: action.payload
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
	fuelReducer,
	systemMonitorReducer
}
