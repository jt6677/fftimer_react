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
{
  /* <div className="box container">
        <img className="logo" src="/assets/circle250.png" />
        <h1>Fall Forward</h1>
        <!-- signin form -->
        <form id="siginform" className="hidden signinform" action="/signin" method="POST" style="display: block;">
            <section>
                <div className="field signin">
                    <label htmlFor="name"><svg className="icon">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
                        </svg></label>
                    <input type="text" name="name" id="name" placeholder="Name or Cellphone">
                </div>
                <div className="field signin">
                    <label htmlFor="password"><svg className="icon">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#lock"></use>
                        </svg></label>
                    <input type="password" name="password" id="password" placeholder="Password">
                </div>
            </section>
            <ul className="buttons">
                <li><input type="submit" value="Log In" className="primary signinbutton disabled"></li>
                <li><a href="/signinandsignup" className="minor">&#10229; No account?</a></li>
            </ul>
        </form>

    </div> */
}
