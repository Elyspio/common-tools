import {applyMiddleware, combineReducers, createStore} from 'redux';
import {componentReducer, fuelReducer} from './Reducer';
import {createLogger} from 'redux-logger';

const getStore = () => {

  const logger = createLogger({
    duration: true,
    // diff:true
  });


  return createStore(combineReducers({component: componentReducer, fuelSetting : fuelReducer}), {}, applyMiddleware(logger));

};

const store = getStore();

export {
  store
};
