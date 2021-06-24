import * as actionTypes from './actionTypes'
import { getMaster, getParent, getProduct, getSubMaster } from "../../elements/api/product";

export const setParentAction =  () => {
	return async (dispatch, getState) => {
		let res = await getParent();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setParent,
			payload: data
		});
	};
};

export const setMasteAction =  () => {
	return async (dispatch, getState) => {
		let res = await getMaster();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setMaster,
			payload: data
		});
	};
};


export const setSubMasteAction =  () => {
	return async (dispatch, getState) => {
		let res = await getSubMaster();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setSubMaster,
			payload: data
		});
	};
};


export const setProducAction =  () => {
	return async (dispatch, getState) => {
		let res = await getProduct();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setProduct,
			payload: data
		});
	};
};
