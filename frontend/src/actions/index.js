import { AUTH_USER, AUTH_ERROR } from "./types";
import history from "../history";
import server from "../apis/server";
import Cookie from "js-cookie";
export const signUp = (formValues) => async (dispatch) => {
  try {
    const response = await server.post("/signup", { ...formValues });
    if (response.data.errormsg !== "") {
      dispatch({ type: AUTH_ERROR, payload: response.data.errormsg });
    } else {
      dispatch({ type: AUTH_USER, payload: response.data.response });
      localStorage.setItem("remember_token", response.data.response);
      Cookie.set("remember_token", response.data.response);
      history.push("/");
    }
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Network Failed" });
  }
};

export const signIn = (formValues) => async (dispatch) => {
  try {
    const response = await server.post("/signin", { ...formValues });
    if (response.data.errormsg !== "") {
      dispatch({ type: AUTH_ERROR, payload: response.data.errormsg });
    } else {
      dispatch({ type: AUTH_USER, payload: response.data.response });
      localStorage.setItem("remember_token", response.data.response);
      Cookie.set("remember_token", response.data.response);
      history.push("/");
    }
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Network Failed" });
  }
};

export const signOut = () => {
  localStorage.removeItem("remember_token");
  Cookie.remove("remember_token");
  return {
    type: AUTH_USER,
    payload: "",
  };
};
