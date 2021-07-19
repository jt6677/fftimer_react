import React, { useState, useEffect } from 'react'
import soundfile from 'assets/welldone.mp3'
import SessionTable from './SessionTable'
import { useFetch } from 'context/FetchContext'
import useCountDown from 'utils/useCountDown'
import moment from 'moment'
import useLocalStorage from 'utils/useLocalStorage'
const basetime = 20 * 1000
// const basetime = parseInt(process.env.REACT_APP_COUNTDOWN_TIME * 1000)
const CountdownClock = () => {
  const [timeLeftPersist] = useLocalStorage('timeLeft', basetime)
  const initialTime =
    timeLeftPersist && parseInt(timeLeftPersist) !== 0
      ? parseInt(timeLeftPersist)
      : basetime
  const [history, setHistory] = useLocalStorage('history', [])
  const [timeLeft, actions, counting, finished] = useCountDown(
    initialTime,
    1000
  )
  const [minute, setMinute] = useState('')
  const [second, setSecond] = useState('')
  const [startedAt, setStartedAt] = useState()
  const [sessionRecordError, setSessionRecordError] = useState()
  const { authClient } = useFetch()
  const audio = new Audio(soundfile)

  // useEffect(() => {
  //   if (history.length > 0) {
  //     localStorage.setItem('sessionhistory', JSON.stringify(history))
  //   }
  // }, [history])

  // useEffect(() => {
  //   const localStorageTimeRemain = localStorage.getItem('timeRemain')
  //   // if (localStorage.hasOwnProperty('timeRemain') === true) {
  //   if (localStorageTimeRemain !== '0' && localStorageTimeRemain !== null) {
  //     setTimeRemain(localStorageTimeRemain)
  //   } else {
  //     setTimeRemain(basetime)
  //   }
  // }, [])

  useEffect(() => {
    changeMinSec(timeLeft)
    // setTimeLeftPersist(timeLeft)
  }, [timeLeft])
  useEffect(() => {
    changeMinSec(initialTime)
    // setTimeLeftPersist(timeLeft)
  }, [])

  useEffect(() => {
    if (finished === true) {
      // console.log('finished', finished)
      audio.play()
      sendEndSig()
      setHistory([
        ...history,
        {
          id: history.length + 1,
          started: startedAt,
          finished: getCurrentTime(),
        },
      ])
    }
  }, [finished])

  useEffect(() => {
    if (history.length > 0) {
      const firstDateofSessionHistory =
        // sessionHistroylocalstorage[0].started.split(' ')
        moment(history[0].started).format('YYYY-MM-DD HH:mm:ss').split(' ')
      const todayString = getCurrentTime()
      const todayDate = moment(todayString)
        .format('YYYY-MM-DD HH:mm:ss')
        .split(' ')
      //   .format('YYYY-MM-DD HH:mm:ss')

      if (todayDate[0] !== firstDateofSessionHistory[0]) {
        console.log('Brand New Day! Let us Go!')
        setHistory([])
      }
    }
  }, [])

  const sendEndSig = () => {
    try {
      authClient(`recordsession`, {
        method: 'post',
        withCredentials: true,
        data: {
          started: startedAt,
        },
      })
    } catch (e) {
      console.log(e)
      setSessionRecordError(e)
    }
  }

  const getCurrentTime = () => {
    let d = new Date()
    let x = d.toISOString()
    return x
  }

  const changeMinSec = (x) => {
    let minutes = parseInt(x / 60 / 1000)
    let seconds = parseInt((x / 1000) % 60)
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    setMinute(minutes)
    setSecond(seconds)
  }

  return (
    <div className="min-h-screen pt-24 bg-blueGray-800">
      <div className="mx-auto text-center">
        <div className="relative top-0 w-9/12 p-12 pt-10 mx-auto text-center shadow-xl lg:w-1/3 h-44 border-1 rounded-xl countdown">
          <div className="pb-4">
            <span className="text-7xl whitebox">{minute}</span>
            <span className="text-7xl whitebox">{second}</span>
            <div className="relative">
              <li>Mins</li>
              <li>Secs</li>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="space-x-2 text-center ">
            <button
              className={!counting ? ' ActiveButton' : 'ButtonDisabled'}
              disabled={counting}
              onClick={() => {
                if (timeLeft === 0) {
                  actions.start()
                  setStartedAt(getCurrentTime())
                } else {
                  actions.resume()
                }
              }}
            >
              <span className="font-bold uppercase">Start</span>
            </button>

            <button
              className={counting ? ' ActiveButton' : 'ButtonDisabled'}
              disabled={!counting}
              onClick={() => actions.pause()}
            >
              <span className="font-bold uppercase">Pause</span>
            </button>
          </div>
        </div>
        {sessionRecordError && (
          <p className="errorMSG">{sessionRecordError} </p>
        )}
        <div className="flex mt-4 text-center">
          {history.length > 0 && <SessionTable history={history} />}
        </div>
      </div>
    </div>
  )
}

export default CountdownClock
