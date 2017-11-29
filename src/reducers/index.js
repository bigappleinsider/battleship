import { combineReducers } from 'redux';

import { reducer as form } from 'redux-form';

import battleshipReducer from './battleship_reducer';


const rootReducer = combineReducers({
  battleshipReducer
});

export default rootReducer;
