import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import getSessionReducer from "./getSessionReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  getSession: getSessionReducer,
});
