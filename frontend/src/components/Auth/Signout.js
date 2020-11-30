import React, { Component } from "react";
import { connect } from "react-redux";
import { signOut } from "../../actions";
import SigninSignup from "./SigninSignup";
export class Signout extends Component {
  componentDidMount() {
    this.props.signOut();
  }

  render() {
    return (
      <div>
        <SigninSignup />
      </div>
    );
  }
}

const mapDispatchToProps = {
  signOut,
};

export default connect(null, mapDispatchToProps)(Signout);
