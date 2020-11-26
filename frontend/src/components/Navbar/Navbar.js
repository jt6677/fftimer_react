import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../Auth";

import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar  ">
      {/* <a href="/logout">Logout</a>
     
        <a href="/signinandsignup">Signup</a>
  
        <a href="/timer">Timer</a>
     
        <a href="/">Date-Pick</a> */}
      <Link
        className="link text-link"
        to="/"
        style={{ backgroundImage: "none" }}
      >
        Timer
      </Link>
      <Link className="link text-link" to="/">
        Date-pick
      </Link>
      <Link className="link text-link " to="/signinandsignup">
        SignIn
      </Link>
      <Link className="link text-link " to="/datepick">
        Date
      </Link>
      <Auth />
    </div>
  );
}

export default Navbar;
