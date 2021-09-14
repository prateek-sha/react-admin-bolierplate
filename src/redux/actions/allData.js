import * as actionTypes from './actionTypes'
import { getMaster, getParent, getProduct, getSubMaster } from "../../elements/api/product";
import { getFavourite, getOrder, getQuote, getUser } from '../../elements/api/other';

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

export const setMasterAction =  () => {
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


export const setUserAction =  () => {
	return async (dispatch, getState) => {
		let res = await getUser();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setUser,
			payload: data
		});
	};
};

export const setOrderAction =  () => {
	return async (dispatch, getState) => {
		let res = await getOrder();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setOrder,
			payload: data
		});
	};
};


export const setQuoteAction =  () => {
	return async (dispatch, getState) => {
		let res = await getQuote();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setQuote,
			payload: data
		});
	};
};


export const setFavouriteAction =  () => {
	return async (dispatch, getState) => {
		let res = await getFavourite();
		let data = []
		if(res.status){
			data = res.data
		}
		dispatch({
			type: actionTypes.setFavourite,
			payload: data
		});
	};
};
