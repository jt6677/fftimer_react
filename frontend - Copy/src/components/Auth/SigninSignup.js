import React, { Component } from "react";
import "./Signin.css";
import { Link } from "react-router-dom";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";

export class SigninSignup extends Component {
  render() {
    return (
      <div className="main-body">
        <Fallfowardpage showWisdom={true} />

        <div className="buttonList">
          <ul className="buttons">
            <li>
              <Link className="primary" to="/signin">
                Log In
              </Link>
            </li>
            <li>
              <Link className="signupbutton" to="/signup">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/" className="minor">
                &#10229; Go back
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SigninSignup;
