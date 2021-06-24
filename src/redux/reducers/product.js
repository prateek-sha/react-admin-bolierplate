import * as actionTypes from "../actions/actionTypes";

const initalState = {
    parent: [],
    master: [],
    subMaster: [],
    product: []
};

export const productReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.setParent:
            return { ...state, parent: action.payload };
        case actionTypes.setMaster:
            return { ...state, master: action.payload };
        case actionTypes.setSubMaster:
            return { ...state, subMaster: action.payload };
        case actionTypes.setProduct:
            return { ...state, product: action.payload };
        default:
            return state;
    }
};
