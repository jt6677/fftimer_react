import { AUTH_USER, AUTH_ERROR } from "../actions/types";

const initialState = {
  authenticated: "",
  errorMessage: "",
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTH_USER:
      return { ...state, authenticated: payload };
    case AUTH_ERROR:
      return { ...state, errorMessage: payload };
    default:
      return state;
  }
};
