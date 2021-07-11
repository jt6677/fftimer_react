import React, { useState, useEffect, useRef } from 'react'
import soundfile from 'assets/welldone.mp3'
import SessionTable from './SessionTable'
import { useFetch } from 'context/FetchContext'
import moment from 'moment'
const basetime = process.env.REACT_APP_COUNTDOWN_TIME
const CountdownClock = () => {
  const [timeRemain, setTimeRemain] = useState('')
  const [minute, setMinute] = useState('')
  const [second, setSecond] = useState('')
  const [counting, setCounting] = useState(false)
  const [sessionStarted, setSessionStarted] = useState()
  const [history, setHistory] = useState([])
  const [sessionRecordError, setSessionRecordError] = useState()
  const { authClient } = useFetch()
  //make a Audio objects
  const audio = new Audio(soundfile)

  function useInterval(callback, timeRemain) {
    const savedCallback = useRef()
    useEffect(() => {
      savedCallback.current = callback
    }, [callback])

    useEffect(() => {
      function tick() {
        savedCallback.current()
      }

      if (timeRemain > 0) {
        let id = setInterval(tick, 1000)

        return () => {
          clearInterval(id)
        }
      }
      if (timeRemain === 0) {
        const x = getCurrentTime()
        setCounting(false)
        setHistory([
          ...history,
          {
            id: history.length + 1,
            started: sessionStarted,
            finished: x,
          },
        ])

        sendEndSig()
        audio.play()
      }
    }, [timeRemain])
  }

  useEffect(() => {
    if (history.length > 0) {
      console.log(history)
      localStorage.setItem('sessionhistory', JSON.stringify(history))
    }
  }, [history])

  useEffect(() => {
    const localStorageTimeRemain = localStorage.getItem('timeRemain')
    // if (localStorage.hasOwnProperty('timeRemain') === true) {
    if (localStorageTimeRemain !== '0' && localStorageTimeRemain !== null) {
      setTimeRemain(localStorageTimeRemain)
    } else {
      setTimeRemain(basetime)
    }
  }, [])

  useEffect(() => {
    changeMinSec(timeRemain)
    localStorage.setItem('timeRemain', timeRemain)
  }, [timeRemain])

  useInterval(
    () => {
      setTimeRemain(timeRemain - 1)
    },
    counting ? timeRemain : null
  )
  useEffect(() => {
    if (localStorage.hasOwnProperty('sessionhistory') === true) {
      const sessionHistroylocalstorage = JSON.parse(
        localStorage.getItem('sessionhistory')
      )
      if (sessionHistroylocalstorage.length > 0) {
        const firstDateofSessionHistory =
          // sessionHistroylocalstorage[0].started.split(' ')
          moment(sessionHistroylocalstorage[0].started)
            .format('YYYY-MM-DD HH:mm:ss')
            .split(' ')
        const todayString = getCurrentTime()
        const todayDate = moment(todayString)
          .format('YYYY-MM-DD HH:mm:ss')
          .split(' ')
        //   .format('YYYY-MM-DD HH:mm:ss')

        console.log('object', todayDate)
        if (todayDate[0] === firstDateofSessionHistory[0]) {
          setHistory(sessionHistroylocalstorage)
        } else {
          console.log('Brand New Day! Let us Go!')
          localStorage.removeItem('sessionhistory')
        }
      }
    }
  }, [])

  const sendEndSig = () => {
    try {
      authClient(`recordsession`, {
        method: 'post',
        withCredentials: true,
        data: {
          //update.mutate({finished: now.toISOString()})}
          started: sessionStarted,
        },
      })
    } catch (e) {
      console.log(e)
      setSessionRecordError(e)
    }
  }

  const renderButtons = () => {
    return (
      <div className="space-x-2 text-center ">
        <button
          className={!counting ? ' ActiveButton' : 'ButtonDisabled'}
          disabled={counting}
          onClick={() => {
            if (timeRemain === 0) {
              setTimeRemain(basetime)
            }
            setSessionStarted(getCurrentTime())
            setCounting(true)
          }}
        >
          <span className="font-bold uppercase">Start</span>
        </button>

        <button
          className={counting ? ' ActiveButton' : 'ButtonDisabled'}
          disabled={!counting}
          onClick={() => setCounting(false)}
        >
          <span className="font-bold uppercase">Pause</span>
        </button>
      </div>
    )
  }

  const getCurrentTime = () => {
    let d = new Date()
    // let x = moment(d).format('YYYY-MM-DD HH:mm:ss')
    // return moment(d).format('YYYY-MM-DD HH:mm:ss')
    let x = d.toISOString()
    return x
  }

  const changeMinSec = (x) => {
    var minutes = parseInt(x / 60, 10)
    let seconds = parseInt(x % 60, 10)
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
        <div className="mt-4">{renderButtons()}</div>
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
