import React, {useState, useEffect} from 'react'
import './CountdownClock.css'
import soundfile from '../../assets/welldone.mp3'

import moment from 'moment'

const basetime = 3600

const CountdownClock = () => {
  const [timeRemain, setTimeRemain] = useState('')
  const [currentSessionID, setCurrentSessionID] = useState('')
  const [minute, setMinute] = useState('')
  const [second, setSecond] = useState('')
  const [counting, setCounting] = useState(false)
  const [sessionStarted, setSessionStarted] = useState('')
  const [history, setHistory] = useState([])

  //make a Audio objects
  const audio = new Audio(soundfile)

  // useEffect(()=>{

  //     if (localStorage.hasOwnProperty("timeRemain") === true) {

  //           setTimeRemain(localStorage.getItem("timeRemain"),
  //           () => changeMinSec(timeRemain)
  //           )

  //     } else {

  //           setTimeRemain(basetime, () => changeMinSec(timeRemain))

  //     }
  // },[timeRemain])

  const renderButtons = () => {
    return (
      <div className="buttonBlock">
        <button
          className={!counting ? ' ActiveButton' : 'ButtonDisabled'}
          disabled={counting}
          onClick={() => timerStart()}
        >
          Start
        </button>
        {'   '}
        <button
          className={counting ? ' ActiveButton' : 'ButtonDisabled'}
          disabled={!counting}
          onClick={() => timerPause()}
        >
          Pause
        </button>
      </div>
    )
  }

  const getCurrentTime = () => {
    let d = new Date()
    let x = moment(d).format('YYYY-MM-DD HH:mm:ss')
    return x
  }

  const onAddSession = () => {
    const finishedSession = {
      ID: history.length + 1,
      StartedAt: sessionStarted,
      UpdatedAt: getCurrentTime(),
    }

    setHistory(previousState => [...previousState, finishedSession])

    // props.sendEndSig(sessionStarted)
    localStorage.setItem('sessionhistory', JSON.stringify(history))
  }

  const timerStart = () => {
    setCounting(true)
    setSessionStarted(getCurrentTime())

    const x = setInterval(() => {
      if (timeRemain > 0) {
        setTimeRemain(prevtimeRemain => prevtimeRemain - 1)

        changeMinSec(timeRemain)
        localStorage.setItem('timeRemain', timeRemain)
      } else {
        audio.play()
        localStorage.removeItem('timeRemain')

        setTimeRemain(basetime)
        setCounting(false)

        onAddSession()

        clearInterval(x)
      }
    }, 1000)

    setCurrentSessionID(x)
  }

  const timerPause = () => {
    clearInterval(currentSessionID)
    setCounting(false)
  }
  const changeMinSec = x => {
    let minutes = parseInt(x / 60, 10)
    let seconds = parseInt(x % 60, 10)
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    setMinute(minutes)
    setSecond(seconds)
  }

  //take the first item from localStorage(sessionHistory)
  //compare to today's date
  //if differet, delete localStorage(sessionHistory)
  //if same date, load localStorage(sessionHistory) into history
  if (localStorage.getItem('sessionhistory') !== null) {
    var sessionHistroylocalstorage = JSON.parse(
      localStorage.getItem('sessionhistory'),
    )
    var firstDateofsessionhistory = sessionHistroylocalstorage[0].StartedAt.split(
      ' ',
    )

    var todayDate = getCurrentTime().split(' ')

    if (todayDate[0] === firstDateofsessionhistory[0]) {
      setHistory(sessionHistroylocalstorage)
    } else {
      localStorage.removeItem('sessionhistory')
    }
  }

  return (
    <div className="mainbody">
      <div className=".timer-box">
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
    </div>
  )
}

export default CountdownClock
