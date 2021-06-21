export const mangeLogin = status => {
  return (dispatch, getState) => {
    dispatch({
      type: "MANGE_LOGIN",
      payload: status
    });
  };
};

