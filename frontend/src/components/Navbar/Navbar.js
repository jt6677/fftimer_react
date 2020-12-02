import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Navbar.css";
export class Navbar extends Component {
  renderAuthButton() {
    if (!this.props.authenticated || this.props.authenticated === "") {
      return (
        <React.Fragment>
          <Link className="link text-link " to="/signinandsignup">
            New Account
          </Link>
          <Link className="link text-link " to="/signin">
            Sign In
          </Link>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Link className="link text-link" to="/">
            Timer
          </Link>
          <Link className="link text-link" to="/datepicker">
            Date-pick
          </Link>
          <Link className="link text-link " to="/signout">
            Sign Out
          </Link>
        </React.Fragment>
      );
    }
  }
  render() {
    return (
      <div className="navbar" style={{ backgroundImage: "none" }}>
        {this.renderAuthButton()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
});

export default connect(mapStateToProps)(Navbar);
