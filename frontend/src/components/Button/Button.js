import React, { Component } from "react";
// import "./Button.css";
export class Button extends Component {
  handleClickStart = () => {
    this.props.timerStart(true);
  };
  handleClickPause = () => {
    this.props.timerStart();
  };

  render() {
    return (
      <div className="buttonBlock">
        <button
          className={!this.props.counting ? " ActiveButton" : "ButtonDisabled"}
          disabled={this.props.counting}
          onClick={() => this.props.timerStart(true)}
        >
          {this.props.startButton}
        </button>
        {"   "}
        <button
          className={this.props.counting ? " ActiveButton" : "ButtonDisabled"}
          disabled={!this.props.counting}
          onClick={() => this.props.timerStart(false)}
        >
          {this.props.pauseButton}
        </button>
      </div>
    );
  }
}
export default Button;
