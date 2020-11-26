import { AUTH_USER, AUTH_ERROR } from "./types";
import history from "../history";
import server from "../apis/server";

export const signUp = (formValues) => async (dispatch) => {
  try {
    const response = await server.post("/signup", { ...formValues });
    if (response.data.errormsg !== "") {
      dispatch({ type: AUTH_ERROR, payload: response.data.errormsg });
      console.log(response.data.errormsg);
    } else {
      dispatch({ type: AUTH_USER, payload: response.data.token });
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token);
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
      console.log(response.data.errormsg);
    } else {
      dispatch({ type: AUTH_USER, payload: response.data.token });
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token);
      history.push("/");
    }
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Network Failed" });
  }
};

export const signOut = () => {
  localStorage.removeItem("token");

  return {
    type: AUTH_USER,
    payload: "",
  };
};
