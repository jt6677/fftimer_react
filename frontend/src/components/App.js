import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import CountdownClock from "./CountdownClock/CountdownClock";
import SigninSignup from "./Auth/SigninSignup";
import Signin from "./Auth/Signin";
import Signup from "./Auth/Signup";
import AppShell from "./AppShell";

import DatePick from "./DatePick/DatePick.js";

import { AuthProvider, AuthContext } from "../context/AuthContext";

const UnauthenticatedRoutes = ({ children, ...rest }) => {
  return (
    <Route {...rest} render={() => <AppShell>{children}</AppShell>}></Route>
  );
};

const AuthenticatedRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        auth.isAuthenticated() ? (
          <AppShell>{children}</AppShell>
        ) : (
          <Redirect to="/signinandsignup" />
        )
      }
    ></Route>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <AuthenticatedRoute path="/clock">
            <CountdownClock />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/datepicker">
            <DatePick />
          </AuthenticatedRoute>

          <UnauthenticatedRoutes path="/signinandsignup">
            <SigninSignup />
          </UnauthenticatedRoutes>
          <UnauthenticatedRoutes exact path="/">
            <SigninSignup />
          </UnauthenticatedRoutes>
          <UnauthenticatedRoutes path="/signin">
            <Signin />
          </UnauthenticatedRoutes>
          <UnauthenticatedRoutes path="/signup">
            <Signup />
          </UnauthenticatedRoutes>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
