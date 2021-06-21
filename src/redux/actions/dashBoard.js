import * as actionTypes from "./actionTypes";
export const setActiveDashboard = dashBoard => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.setActiveDashboard,
      payload: dashBoard
    });
  };
};

