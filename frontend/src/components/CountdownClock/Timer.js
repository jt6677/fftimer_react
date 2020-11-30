import React, { Component } from "react";
import Countdown, { zeroPad } from "react-countdown";

class Timer extends Component {
  renderer = ({ minutes, seconds, completed, api: { start, pause } }) => {
    return (
      <span>
        {zeroPad(minutes)}: {zeroPad(seconds)}
        <button onClick={start}>Start</button>
        <button onClick={pause}>pause</button>
      </span>
    );
  };

  render() {
    return (
      <div>
        <Countdown
          date={Date.now() + 5000}
          autoStart={false}
          renderer={this.renderer}
          zerPadTime={5}
        />
      </div>
    );
  }
}

export default Timer;
