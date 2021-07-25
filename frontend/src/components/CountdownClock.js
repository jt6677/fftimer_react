import React, { useState, useEffect, useRef } from 'react'
import soundfile from 'assets/welldone.mp3'
import SessionTable from './SessionTable'
import { useFetch } from 'context/FetchContext'
import moment from 'moment'
import useLocalStorage from 'utils/useLocalStorage'

const basetime = process.env.REACT_APP_COUNTDOWN_TIME
const CountdownClock = () => {
  const [timeRemain, setTimeRemain] = useState('')
  const [minute, setMinute] = useState('')
  const [second, setSecond] = useState('')
  const [counting, setCounting] = useState(false)
  const [sessionStarted, setSessionStarted] = useState()
  const [history, setHistory] = useLocalStorage('history', [])
  const [timeLeftPersist, setTimeLeftPersist] = useLocalStorage(
    'timeLeft',
    basetime
  )
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
        setCounting(false)
        setHistory([
          ...history,
          {
            id: history.length + 1,
            started: sessionStarted,
            finished: getCurrentTime(),
          },
        ])

        sendEndSig()
        audio.play()
      }
    }, [timeRemain])
  }

  // useEffect(() => {
  //   if (history.length > 0) {
  //     console.log(history)
  //     localStorage.setItem('sessionhistory', JSON.stringify(history))
  //   }
  // }, [history])

  useEffect(() => {
    // const localStorageTimeRemain = localStorage.getItem('timeRemain')
    if (timeLeftPersist !== '0' && timeLeftPersist !== null) {
      setTimeRemain(timeLeftPersist)
    } else {
      setTimeRemain(basetime)
    }
  }, [])

  useEffect(() => {
    let minutes = parseInt(timeRemain / 60, 10)
    let seconds = parseInt(timeRemain % 60, 10)
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    setMinute(minutes)
    setSecond(seconds)
    setTimeLeftPersist(timeRemain)
  }, [timeRemain])

  useInterval(
    () => {
      setTimeRemain(timeRemain - 1)
    },
    counting ? timeRemain : null
  )
  //if the today !== histor[0]
  //clear history and start a brand new day
  useEffect(() => {
    if (history.length > 0) {
      const firstDateofSessionHistory = moment(history[0].started)
        .format('YYYY-MM-DD HH:mm:ss')
        .split(' ')
      const todayString = getCurrentTime()
      const todayDate = moment(todayString)
        .format('YYYY-MM-DD HH:mm:ss')
        .split(' ')
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
          //update.mutate({finished: now.toISOString()})}
          started: sessionStarted,
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

  return (
    <div className="min-h-screen pt-24 bg-blueGray-800">
      <div className="mx-auto text-center">
        <div className="relative top-0 p-12 pt-10 mx-auto text-center shadow-xl w-80 h-44 border-1 rounded-xl countdown">
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
