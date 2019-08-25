import {applyMiddleware, combineReducers, createStore} from 'redux';
import {componentReducer, fuelReducer, systemMonitorReducer} from './Reducer';
import {createLogger} from 'redux-logger';
import {Action} from "./Action";

const getStore = () => {
	
	const logger = createLogger({
		duration: true,
		// diff:true
	});
	
	
	return createStore(combineReducers({
		component: componentReducer,
		fuelSetting: fuelReducer,
		systemMonitor: systemMonitorReducer
	}), {}, applyMiddleware(logger));
	
};

const store = getStore();


// default component
store.dispatch({
	type: Action.changeComponent.type,
	payload: Action.changeComponent.payload.dev.startServers
});

export {
	store
};
