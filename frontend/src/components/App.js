import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import CountdownClock from "./CountdownClock/CountdownClock";
import SigninSignup from "./Auth/SigninSignup";
import Signin from "./Auth/Signin";
import Signup from "./Auth/Signup";
import Signout from "./Auth/Signout";
import DatePick from "./DatePick/DatePick";
import DateShow from "./DateShow/DateShow";
import history from "../history";

export class App extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <Navbar />

          <Switch>
            <Route path="/" exact component={CountdownClock} />
            <Route path="/signinandsignup" exact component={SigninSignup} />
            <Route path="/signin" exact component={Signin} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/signout" exact component={Signout} />
            <Route path="/datepick" exact component={DatePick} />
            <Route path="/datepick/:id" exact component={DateShow} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
