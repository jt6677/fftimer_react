import {
  AUTH_USER,
  AUTH_ERROR,
  GET_DAILYSESSION,
  GET_DAILYSESSION_ERROR,
} from "./types";
import history from "../history";
import server from "../apis/server";
import Cookie from "js-cookie";

export const signUp = (formValues) => async (dispatch) => {
  let config = {
    url: "/signup",
    method: "post",
    data: { ...formValues },
  };
  console.log(formValues);
  try {
    const response = await server.request(config);
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
  let config = {
    url: "/signin",
    method: "post",
    data: { ...formValues },
  };

  try {
    // const response = await server.post("/signin", { ...formValues });
    const response = await server.request(config);
    if (response.data.errormsg !== "") {
      dispatch({ type: AUTH_ERROR, payload: response.data.errormsg });
    } else {
      dispatch({ type: AUTH_USER, payload: response.data.response });
      localStorage.setItem("remember_token", response.data.response);
      Cookie.set("remember_token", response.data.response, {
        sameSite: "None",
        secure: true,
      });
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
export const checkDailySession = (formValues) => async (dispatch) => {
  let link = `/dailysession/${formValues}`;
  let config = {
    url: link,
    method: "post",
    data: { usertoken: localStorage.getItem("remember_token") },
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Content-Type": "application/json",
    // },
  };

  try {
    const response = await server.request(config);

    if (response.data.length === 0) {
      // console.log(`No Session is Found on ${formValues}`);
      dispatch({
        type: GET_DAILYSESSION_ERROR,
        payload: `No Session is Found on ${formValues}`,
      });
    } else {
      console.log(response.data);
      dispatch({
        type: GET_DAILYSESSION,
        payload: response.data,
      });
      history.push(`/date/${formValues}`);
    }
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Network Failed" });
  }
};

export const sendEndSig = (formValues) => async (dispatch) => {
  let config = {
    url: "/recordsession",
    method: "post",
    // withCredentials: true,
    data: {
      usertoken: localStorage.getItem("remember_token"),
      startedat: formValues,
    },
    // headers: {
    //   "Access-Control-Allow-Origin": "https://jt6677.github.io/",
    //   "Access-Control-Allow-Credentials": "true",
    // },
  };

  try {
    server.request(config);
  } catch (err) {
    console.log(err);
  }
};
