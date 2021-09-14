import * as actionTypes from "../actions/actionTypes";

const initalState = {
    parent: [],
    master: [],
    subMaster: [],
    product: [],
    user: [],
    order: null,
    quote: [],
    favourite: []
};

export const allDataReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.setParent:
            return { ...state, parent: action.payload };
        case actionTypes.setMaster:
            return { ...state, master: action.payload };
        case actionTypes.setSubMaster:
            return { ...state, subMaster: action.payload };
        case actionTypes.setProduct:
            return { ...state, product: action.payload };
        case actionTypes.setUser:
            return { ...state, user: action.payload };
        case actionTypes.setOrder:
            return { ...state, order: action.payload }
        case actionTypes.setQuote:
            return { ...state, quote: action.payload }
        case actionTypes.setFavourite:
            return { ...state, favourite: action.payload }
        default:
            return state;
    }
};
