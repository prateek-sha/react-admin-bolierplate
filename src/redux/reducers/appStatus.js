
const initalState = {
  login: false
};

export const appStatus = (state = initalState, action) => {
  switch (action.type) {
    case "MANGE_LOGIN":
      return { login: action.payload };
    default:
      return state;
  }
};
