import React, { Component } from "react";
import "./CountdownClock.css";
import soundfile from "../../assets/welldone.mp3";
import SessionTable from "../SessionTable/SessionTable.js";
import requireAuth from "../Auth/requireAuth";
import server from "../../apis/server";
let basetime = 1;
export class CountdownClock extends Component {
  state = {
    timeRemain: basetime,
    currentSessionID: null,
    minutes: "",
    seconds: "",
    counting: false,
    sessionStarted: "",
    history: [],
  };
  //make a Audio objects
  audio = new Audio(soundfile);
  //addZero and getTime return 01:05:58
  addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };
  // sendCookie = async () => {
  //   let ss = "ss";
  //   try {
  //     const resp = server.post("/cookie", { withCredentials: true, ss });

  //     console.log(resp.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  sendEndSig = async () => {
    let config = {
      url: "/recordsession",
      method: "post",
      withCredentials: true,
      data: {
        startedat: this.state.sessionStarted,
      },
    };

    try {
      const resp = server.request(config);

      console.log(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  //   axios("http://mysite.com/api/things/", {
  //   method: "post",
  //   data: someJsonData,
  //   withCredentials: true
  // })
  // sendEndSig = async () => {
  //   let startedat = this.state.sessionStarted;
  //   try {
  //     const resp = await server.post(
  //       "/recordsession",

  //       { withCredentials: true }
  //     );
  //     console.log(resp.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // sendCookie = async () => {
  //   try {
  //     const resp = server.get("/cookie", { withCredentials: true });

  //     console.log(resp.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  renderButtons() {
    return (
      <div className="buttonBlock">
        <button
          className={!this.state.counting ? " ActiveButton" : "ButtonDisabled"}
          disabled={this.state.counting}
          onClick={() => this.timerStart()}
        >
          Start
        </button>
        {"   "}
        <button
          className={this.state.counting ? " ActiveButton" : "ButtonDisabled"}
          disabled={!this.state.counting}
          onClick={() => this.timerPause()}
        >
          Pause
        </button>
      </div>
    );
  }

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
      this.sendEndSig();
      return {
        history,
      };
    });
  };
  timerStart = () => {
    this.setState({
      counting: true,
      sessionStarted: this.getCurrentTime(),
    });

    const x = setInterval(() => {
      // console.log(x);
      // if (this.state.counting === false) {
      //   clearInterval(x);
      // }
      if (this.state.timeRemain !== 0) {
        this.setState((prevState) => {
          return { timeRemain: prevState.timeRemain - 1 };
        });
        localStorage.setItem("timeRemain", this.state.timeRemain);
        this.countDown();
      } else {
        this.audio.play();
        localStorage.removeItem("timeRemain");
        this.setState({
          timeRemain: basetime,
          counting: false,
        });
        this.onAddSession();
        clearInterval(x);
      }
    }, 1000);
    this.setState({
      currentSessionID: x,
    });
  };
  timerPause() {
    clearInterval(this.state.currentSessionID);
    this.setState({
      counting: false,
    });
  }
  countDown = () => {
    let minutes = parseInt(this.state.timeRemain / 60, 10);
    let seconds = parseInt(this.state.timeRemain % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    this.setState({
      minutes: minutes,
      seconds: seconds,
    });
  };
  componentDidMount() {
    const t = localStorage.getItem("timeRemain");
    if (t !== null) {
      this.setState({
        timeRemain: t,
      });
      let minutes = parseInt(t / 60, 10);
      let seconds = parseInt(t % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      this.setState({
        minutes: minutes,
        seconds: seconds,
      });
    } else {
      this.setState({
        timeRemain: basetime,
      });
      this.countDown();
    }
  }
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

        {/* <Button
          timerStart={this.timerStart}
          counting={this.state.counting}
          startButton="Start"
          pauseButton="Pause"
        /> */}
        {this.renderButtons()}
        <SessionTable history={this.state.history} />
      </div>
    );
  }
}

export default requireAuth(CountdownClock);
