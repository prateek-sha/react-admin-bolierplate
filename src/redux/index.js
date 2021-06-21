import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { dashboard } from "./reducers/dashBoard";
import {appStatus} from './reducers/appStatus'

const reducer = combineReducers({
  dashboard , 
  appStatus
});

export const store = createStore(reducer, applyMiddleware(thunk));
