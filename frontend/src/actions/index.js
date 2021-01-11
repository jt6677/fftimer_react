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
    // headers: {
    //   "Access-Control-Allow-Origin": "https://1q.gg/",
    //   "Access-Control-Allow-Credentials": "true",
    // },
  };

  try {
    const response = await server.request(config);
    if (response.data.errormsg !== "") {
      dispatch({ type: AUTH_ERROR, payload: response.data.errormsg });
    } else {
      dispatch({ type: AUTH_USER, payload: response.data.response });
      // localStorage.setItem("jwt", response.data.response);
      Cookie.set("jwt", response.data.response, { sameSite: "strict" });
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
    // headers: {
    //   "Access-Control-Allow-Origin": "https://1q.gg/",
    //   "Access-Control-Allow-Credentials": "true",
    // },
  };

  try {
    // const response = await server.post("/signin", { ...formValues });
    const response = await server.request(config);
    console.log(response);
    if (response.data.errormsg !== "") {
      dispatch({ type: AUTH_ERROR, payload: response.data.errormsg });
    } else {
      dispatch({ type: AUTH_USER, payload: response.data.response });
      // localStorage.setItem("jwt", response.data.response);
      Cookie.set("jwt", response.data.response, { sameSite: "strict" });
      history.push("/");
    }
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Network Failed" });
  }
};

export const signOut = () => {
  localStorage.removeItem("jwt");
  Cookie.remove("jwt");
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
    // data: { usertoken: localStorage.getItem("jwt") },
    withCredentials: true,
    // crossDomain: true,
    // mode: "cors",
    // headers: {
    //   "Access-Control-Allow-Origin": "https://1q.gg/",
    //   "Access-Control-Allow-Credentials": "true",
    // },
  };

  try {
    const response = await server.request(config);
    // const response = await fetch(
    //   "http://localhost:8080/dailysession/20201208",
    //   {
    //     headers: {
    //       "Access-Control-Allow-Origin": "https://1q.gg/",
    //       "Access-Control-Allow-Credentials": "true",
    //     },
    //     credentials: "include",
    //     mode: "cors",
    //     method: "POST",
    //   }
    // );
    if (response.data.length === 0) {
      dispatch({
        type: GET_DAILYSESSION_ERROR,
        payload: `No Session is Found on ${formValues}`,
      });
    } else {

      dispatch({
        type: GET_DAILYSESSION,
        payload: response.data,
      });
      history.push(`/date/${formValues}`);
    }
  } catch (e) {
    console.log(e);
    dispatch({ type: AUTH_ERROR, payload: "Network Failed" });
  }
};

export const sendEndSig = (formValues) => async (dispatch) => {
  let config = {
    url: "/recordsession",
    method: "post",
    withCredentials: true,
    data: {
      // usertoken: localStorage.getItem("jwt"),
      startedat: formValues,
    },
    // headers: {
    //   "Access-Control-Allow-Origin": "https://1q.gg/",
    //   "Access-Control-Allow-Credentials": "true",
    // },
  };

  try {
    server.request(config);
  } catch (err) {
    console.log(err);
  }
};
