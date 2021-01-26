import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// import "./Navbar.css";

function Navbar() {
  const auth = useContext(AuthContext);
  if (!auth.isAuthenticated()) {
    return (
      <div className="navbar">
        <Link className="link text-link " to="/signinandsignup">
          New Account
        </Link>
        <Link className="link text-link " to="/signin">
          Sign In
        </Link>
      </div>
    );
  } else {
    return (
      <div className="navbar">
        <Link className="link text-link" to="/clock">
          Timer
        </Link>
        <Link className="link text-link" to="/datepicker">
          Date-pick
        </Link>
        <Link
          className="link text-link "
          onClick={() => {
            auth.logout();
          }}
        >
          Sign Out
        </Link>
      </div>
    );
  }
}

export default Navbar;
