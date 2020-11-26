import Axios from "axios";
import React, { Component } from "react";

export class SendLoad extends Component {
  state = {
    fromGoserver: "",
  };
  handleclick = () => {
    let jessica = "hairyFatBitch";

    Axios.post("http://localhost:8080/jessica", { jessica })
      .then((res) => {
        console.log(res);
        this.setState({
          fromGoserver: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div>
        <button onClick={this.handleclick}>HIT IT</button>
        <h1>{this.state.fromGoserver}</h1>
      </div>
    );
  }
}

export default SendLoad;
