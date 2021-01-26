import React, { useState, useEffect, useRef } from "react";
import soundfile from "../../assets/welldone.mp3";
import moment from "moment";
// import { useHistoryContext } from "../../context/useHistory";
import SessionTable from "../SessionTable/SessionTable";
import server from "../../apis/server";
var basetime = 2;
const CountdownClock = () => {
  const [timeRemain, setTimeRemain] = useState("");

  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");
  const [counting, setCounting] = useState(false);
  const [sessionStarted, setSessionStarted] = useState("");
  const [history, setHistory] = useState([]);

  //make a Audio objects
  const audio = new Audio(soundfile);

  function useInterval(callback, timeRemain) {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      if (timeRemain > 0) {
        let id = setInterval(tick, 1000);

        return () => {
          clearInterval(id);
        };
      }
      if (timeRemain === 0) {
        setCounting(false);
        setHistory([
          ...history,
          {
            ID: history.length + 1,
            StartedAt: sessionStarted,
            UpdatedAt: getCurrentTime(),
          },
        ]);
        sendEndSig();
        audio.play();
      }
    }, [timeRemain]);
  }

  useEffect(() => {
    localStorage.setItem("sessionhistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const localStorageTimeRemain = localStorage.getItem("timeRemain");
    // if (localStorage.hasOwnProperty('timeRemain') === true) {
    if (localStorageTimeRemain !== "0" && localStorageTimeRemain !== null) {
      setTimeRemain(localStorageTimeRemain);
    } else {
      setTimeRemain(basetime);
    }
  }, []);

  useEffect(() => {
    changeMinSec(timeRemain);
    localStorage.setItem("timeRemain", timeRemain);
  }, [timeRemain]);

  useInterval(
    () => {
      setTimeRemain(timeRemain - 1);
    },
    counting ? timeRemain : null
  );
  useEffect(() => {
    var sessionHistroylocalstorage = JSON.parse(
      localStorage.getItem("sessionhistory")
    );
    if (sessionHistroylocalstorage.length > 0) {
      var firstDateofsessionhistory = sessionHistroylocalstorage[0].StartedAt.split(
        " "
      ); // console.log(firstDateofsessionhistory[0]);
      var todayDate = getCurrentTime().split(" ");

      if (todayDate[0] === firstDateofsessionhistory[0]) {
        setHistory(sessionHistroylocalstorage);
      } else {
        localStorage.removeItem("sessionhistory");
      }
    }
  }, []);

  const sendEndSig = async () => {
    let config = {
      url: "/recordsession",
      method: "post",
      withCredentials: true,
      data: {
        startedat: sessionStarted,
      },
    };

    try {
      server.request(config);
    } catch (err) {
      console.log(err);
    }
  };

  const renderButtons = () => {
    return (
      <div className="buttonBlock">
        <button
          className={!counting ? " ActiveButton" : "ButtonDisabled"}
          disabled={counting}
          onClick={() => {
            setCounting(true);
            if (timeRemain === 0) setTimeRemain(basetime);
            setSessionStarted(getCurrentTime());
          }}
        >
          Start
        </button>
        {"   "}
        <button
          className={counting ? " ActiveButton" : "ButtonDisabled"}
          disabled={!counting}
          onClick={() => setCounting(false)}
        >
          Pause
        </button>
      </div>
    );
  };

  const getCurrentTime = () => {
    let d = new Date();
    let x = moment(d).format("YYYY-MM-DD HH:mm:ss");
    return x;
  };

  const changeMinSec = (x) => {
    var minutes = parseInt(x / 60, 10);
    let seconds = parseInt(x % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    setMinute(minutes);
    setSecond(seconds);
  };

  return (
    <div className="timer-page">
      <div className="timer-box">
        <div className="countdown">
          <div className="tiles">
            <span className="minute whitebox">{minute}</span>
            <span className="second whitebox">{second}</span>
            <div className="labels">
              <li>Mins</li>
              <li>Secs</li>
            </div>
          </div>
        </div>
      </div>
      {renderButtons()}
      {history.length > 0 && <SessionTable history={history} />}
    </div>
  );
};

export default CountdownClock;
