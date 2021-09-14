import { createStore, applyMiddleware, combineReducers } from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import { dashboard } from "./reducers/dashBoard";
import { appStatus } from './reducers/appStatus';
import { allDataReducer } from './reducers/allData';
import thunk from "redux-thunk";

const reducer = combineReducers({
  dashboard, 
  appStatus,
  allDataReducer
});

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
