import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "./actions/";
import { Link } from "react-router-dom";

export class Auth extends Component {
  onSignOutClick = () => {
    this.props.signOut();
  };

  //   onAuthChange = (isSignedIn) => {
  //     if (isSignedIn) {
  //       this.props.signIn("First-React-Account");
  //     } else {
  //       this.props.signOut();
  //     }
  //   };
  renderAuthButton() {
    if (this.props.isSignedIn) {
      return (
        <Link className="link text-link " to="/" onClick={this.onSignOutClick}>
          Sign Out
        </Link>
      );
    } else {
      return (
        <Link className="link text-link " to="/signin">
          Sign In
        </Link>
      );
    }
  }
  // renderAuthButton() {

  //   <Link className="link text-link " to="/datepick">
  //   Date
  // </Link>

  //   if (this.props.isSignedIn) {
  //     return (
  //       <button onClick={this.onSignOutClick} className="ui red google button">
  //         <i className="google icon" />
  //         Sign Out
  //       </button>
  //     );
  //   } else {
  //     return (
  //       <button onClick={this.onSignInClick} className="ui red google button">
  //         <i className="google icon" />
  //         Sign In
  //       </button>
  //     );
  //   }
  // }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => ({ isSignedIn: state.auth.isSignedIn });

const mapDispatchToProps = { signIn, signOut };

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
