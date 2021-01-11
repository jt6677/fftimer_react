import React, { Component } from "react";
import "./CountdownClock.css";
import soundfile from "../../assets/welldone.mp3";
import SessionTable from "../SessionTable/SessionTable.js";
import requireAuth from "../Auth/requireAuth";
import moment from "moment";
import { sendEndSig } from "../../actions";
import { connect } from "react-redux";

var basetime = 3600;
export class CountdownClock extends Component {
  state = {
    timeRemain: "",
    currentSessionID: null,
    minutes: "",
    seconds: "",
    counting: false,
    sessionStarted: "",
    history: [],
  };
  //make a Audio objects
  audio = new Audio(soundfile);

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
    let x = moment(d).format("YYYY-MM-DD HH:mm:ss");
    return x;
  }

  onAddSession = () => {
    const finishedSession = {
      ID: this.state.history.length + 1,
      StartedAt: this.state.sessionStarted,
      UpdatedAt: this.getCurrentTime(),
    };

    this.setState((previousState) => ({
      history: [...previousState.history, finishedSession],
    }));

    this.props.sendEndSig(this.state.sessionStarted);
    localStorage.setItem("sessionhistory", JSON.stringify(this.state.history));
  };

  timerStart = () => {
    this.setState({
      counting: true,
      sessionStarted: this.getCurrentTime(),
    });

    const x = setInterval(() => {
      if (this.state.timeRemain > 0) {
        this.setState((prevState) => {
          return { timeRemain: prevState.timeRemain - 1 };
        });
        this.changeMinSec(this.state.timeRemain);
        localStorage.setItem("timeRemain", this.state.timeRemain);
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
  changeMinSec = (x) => {
    let minutes = parseInt(x / 60, 10);
    let seconds = parseInt(x % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    this.setState({
      minutes: minutes,
      seconds: seconds,
    });
  };
  componentDidMount() {
    if (localStorage.hasOwnProperty("timeRemain") === true) {

      this.setState(
        {
          timeRemain: localStorage.getItem("timeRemain"),
        },
        () => this.changeMinSec(this.state.timeRemain)
      );
    } else {
      this.setState(
        {
          timeRemain: basetime,
        },
        () => this.changeMinSec(this.state.timeRemain)
      );
    }
    //take the first item from localStorage(sessionHistory)
    //compare to today's date
    //if differet, delete localStorage(sessionHistory)
    //if same date, load localStorage(sessionHistory) into this.state.history
    if (localStorage.getItem("sessionhistory") !== null) {
      var sessionHistroylocalstorage = JSON.parse(localStorage.getItem("sessionhistory"))
      var firstDateofsessionhistory = sessionHistroylocalstorage[0].StartedAt.split(" ")
      console.log(firstDateofsessionhistory[0]);
      var todayDate = this.getCurrentTime().split(" ");

      if (todayDate[0] === firstDateofsessionhistory[0]) {
        this.setState({
          history: sessionHistroylocalstorage
        })
      } else {
        localStorage.removeItem("sessionhistory")
      }

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

        {this.renderButtons()}
        <SessionTable history={this.state.history} />
      </div>
    );
  }
}

const mapDispatchToProps = { sendEndSig };
export default requireAuth(connect(null, mapDispatchToProps)(CountdownClock));
