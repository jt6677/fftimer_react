import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";

// import signupReducer from "./signupReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  // signUp: signupReducer,
});
