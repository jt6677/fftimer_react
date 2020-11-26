import Axios from "axios";
import React, { Component } from "react";

export class SendOjb extends Component {
  state = {
    fromGoserver: "",
  };
  handleclick = () => {
    let config = { fatbitch: "JessicaSou", fattoe: "SuckmeHairyBitch" };

    Axios.post("http://localhost:8080/recieve", config);
  };

  render() {
    return (
      <div>
        <h1>Let us Click that cun</h1>
        <button onClick={this.handleclick}>HIT IT</button>
        <h1>{this.state.fromGoserver}</h1>
      </div>
    );
  }
}

export default SendOjb;
