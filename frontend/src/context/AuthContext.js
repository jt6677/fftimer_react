import React, { createContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookie from "js-cookie";
const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();

  const token = localStorage.getItem("token");
  // const userInfo = localStorage.getItem('userInfo');
  const expiresAt = localStorage.getItem("expiresAt");
  const [authState, setAuthState] = useState({
    token,
    expiresAt,
    // userInfo: userInfo ? JSON.parse(userInfo) : {}
  });
  const [sessiontableState, setSessiontableState] = useState([]);
  const setAuthInfo = ({ token, expiresAt }) => {
    console.log(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expiresAt", expiresAt);
    Cookie.set("token", token, { sameSite: "strict" });
    setAuthState({
      token,
      // userInfo,
      expiresAt,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setAuthState({});
    history.push("/");
  };

  const isAuthenticated = () => {
    if (!authState.expiresAt) {
      return false;
    }
    return new Date() < new Date(authState.expiresAt);
  };

  // const getAccessToken = () => {
  //   return localStorage.getItem("token");
  // };

  // const getNewToken = async () => {
  //   try {
  //     const { data } = await publicFetch.get("/token/refresh");
  //     setAuthState(Object.assign({}, authState, { token: data.token }));
  //   } catch (err) {
  //     return err;
  //   }
  // };

  // const getNewTokenForRequest = async (failedRequest) => {
  //   const { data } = await publicFetch.get("/token/refresh");

  //   failedRequest.response.config.headers[
  //     "Authorization"
  //   ] = `Bearer ${data.token}`;

  //   localStorage.setItem("token", data.token);

  //   return Promise.resolve();
  // };

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        sessiontableState,
        setSessiontableState,
        logout,
        isAuthenticated,
        // isAdmin,
        // getNewToken,
        // getAccessToken,
        // getNewTokenForRequest,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
