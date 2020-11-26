import React, { Component } from "react";
import Button from "../Button/Button";
import "./CountdownClock.css";
import soundfile from "../../assets/welldone.mp3";
import SessionTable from "../SessionTable/SessionTable.js";
export class CountdownClock extends Component {
  state = {
    timer: 2,
    minutes: "",
    seconds: "",
    counting: false,
    sessionStarted: "",
    history: [],
  };
  //make a Audio object
  audio = new Audio(soundfile);
  //addZero and getTime return 01:05:58
  addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

  getCurrentTime() {
    let d = new Date();

    let h = this.addZero(d.getHours());
    let m = this.addZero(d.getMinutes());
    let s = this.addZero(d.getSeconds());
    let x = h + ":" + m + ":" + s;
    return x;
  }

  onAddSession = () => {
    this.setState((state) => {
      const history = [
        ...state.history,
        {
          id: state.history.length + 1,
          started: this.state.sessionStarted,
          ended: this.getCurrentTime(),
        },
      ];
      return {
        history,
      };
    });
  };
  timerStart = (signal) => {
    if (signal) {
      this.setState({
        counting: true,
        sessionStarted: this.getCurrentTime(),
      });
      const x = setInterval(() => {
        this.countDown();

        this.setState(
          (prevState, prevProps) => {
            return { timer: prevState.timer - 1 };
          },

          () => {
            if (this.state.counting === false) {
              clearInterval(x);
            }
            if (this.state.timer < 0) {
              this.audio.play();
              this.setState({
                timer: 2,
                counting: false,
              });
              this.onAddSession();
              clearInterval(x);
            }
          }
        );
      }, 1000);
    }
    if (!signal) {
      this.setState({
        counting: false,
      });
      // clearInterval(x);
    }
  };
  countDown = () => {
    let minutes = parseInt(this.state.timer / 60, 10);
    let seconds = parseInt(this.state.timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    this.setState({
      minutes: minutes,
      seconds: seconds,
    });
  };

  render() {
    return (
      <div className="mainbody">
        <div className=".timer-box">
          <div className="countdown">
            <div className="tiles">
              <span className="minute whitebox">{this.state.minutes}</span>
              <span className="second whitebox">{this.state.seconds}</span>
              <div className="labels">
                <li>Mins</li>
                <li>Secs</li>
              </div>
            </div>
          </div>
        </div>
        {/* <button onClick={audio.play()}></button> */}
        <Button
          timerStart={this.timerStart}
          counting={this.state.counting}
          startButton="Start"
          pauseButton="Pause"
        />
        <SessionTable history={this.state.history} />
        {/* <div>{historyMap}</div> */}
      </div>
    );
  }
}

export default CountdownClock;
