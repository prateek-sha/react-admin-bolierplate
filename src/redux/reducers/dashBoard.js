import * as actionTypes from "../actions/actionTypes";

const initalState = {
  activeDashBoard: ""
};

export const dashboard = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.setActiveDashboard:
      return { activeDashBoard: action.payload };

    default:
      return state;
  }
};
