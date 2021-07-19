import React from 'react'
import useLocalStorage from 'utils/useLocalStorage'
const useCountDown = (timeToCount = 60 * 1000, interval = 1000) => {
  const [timeLeft, setTimeLeft] = React.useState(0)
  const [counting, setCounting] = React.useState(false)
  const [finished, setFinished] = React.useState(false)
  const [timeLeftLocal, setTimeLeftLocal] = useLocalStorage(
    'timeLeft',
    timeToCount
  )
  const timer = React.useRef({})

  const run = (ts) => {
    if (!timer.current.started) {
      timer.current.started = ts
      timer.current.lastInterval = ts
    }

    const localInterval = Math.min(interval, timer.current.timeLeft || Infinity)
    if (ts - timer.current.lastInterval >= localInterval) {
      timer.current.lastInterval += localInterval
      //       setTimeLeftLocal(timeToCount - timer.current.lastInterval)
      setTimeLeft((timeLeft) => {
        timer.current.timeLeft = timeLeft - localInterval
        setTimeLeftLocal(timer.current.timeLeft)
        return timer.current.timeLeft
      })
    }

    //     console.log('continue?', ts - timer.current.started)
    if (ts - timer.current.started < timer.current.timeToCount) {
      timer.current.requestId = window.requestAnimationFrame(run)
    } else {
      timer.current = {}
      setTimeLeft(0)
      setTimeLeftLocal(0)
      setCounting(false)
      setFinished(true)
    }
  }

  const start = React.useCallback((ttc) => {
    window.cancelAnimationFrame(timer.current.requestId)

    const newTimeToCount = ttc !== undefined ? ttc : timeToCount
    const timeLeftPersist = parseInt(timeLeftLocal)
    timer.current.started = null
    timer.current.lastInterval = null
    timer.current.timeToCount =
      timeLeftPersist > 0 ? timeLeftPersist : newTimeToCount
    timer.current.requestId = window.requestAnimationFrame(run)
    setTimeLeftLocal(timer.current.timeToCount)
    setTimeLeft(newTimeToCount)
    setCounting(true)
    setFinished(false)
  }, [])

  const pause = React.useCallback(() => {
    window.cancelAnimationFrame(timer.current.requestId)
    timer.current.started = null
    timer.current.lastInterval = null
    timer.current.timeToCount = timer.current.timeLeft
    setCounting(false)
  }, [])

  const resume = React.useCallback(() => {
    if (!timer.current.started && timer.current.timeLeft > 0) {
      window.cancelAnimationFrame(timer.current.requestId)
      timer.current.requestId = window.requestAnimationFrame(run)
    }
    setCounting(true)
  }, [])

  const reset = React.useCallback(() => {
    if (timer.current.timeLeft) {
      window.cancelAnimationFrame(timer.current.requestId)
      timer.current = {}
      setTimeLeft(0)
    }
    setCounting(false)
  }, [])

  const actions = React.useMemo(() => ({ start, pause, resume, reset }), [])

  React.useEffect(() => reset, [])

  return [timeLeft, actions, counting, finished]
}

export default useCountDown
