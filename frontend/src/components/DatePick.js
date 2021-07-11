import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SVGIcon from 'assets/SVGIcon'
import { useFetch } from 'context/FetchContext'
import moment from 'moment'
import Fallfowardpage from './fallfowardpage'
import SessionTable from './SessionTable'
import { InputwithIcon, PrimaryButton } from 'components/lib'

const DatePick = () => {
  const [sessions, setSessions] = useState([])
  const [selecteddate, setSelecteddate] = useState(new Date())
  const { authClient } = useFetch()
  const submitDate = async () => {
    const formatedDate = moment(selecteddate).format('YYYYMMDD')

    try {
      const data = await authClient(`dailysession/${formatedDate}`, {
        method: 'post',
        withCredentials: true,
      })
      setSessions(data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    return <SessionTable history={sessions} />
  }, [sessions])
  return (
    <>
      <div className="min-h-screen bg-blueGray-800">
        <div className="flex flex-col items-center justify-center pt-16 text-white lg:pt-32 ">
          <Fallfowardpage showWisdom={true} />
          <form
            onSubmit={(evt) => {
              evt.preventDefault()
              submitDate()
            }}
          >
            <InputwithIcon>
              <SVGIcon iconName="calendar" />
              <DatePicker
                className="w-full p-4 text-lg text-white rounded-r outline-none bg-coolGray-700 hover:bg-coolGray-600"
                selected={selecteddate}
                onChange={(e) => setSelecteddate(e)}
                dateFormat="yyyyMMdd"
                isClearable
              />
            </InputwithIcon>
            <PrimaryButton className="w-full mt-4" type="submit">
              <div>Go</div>
            </PrimaryButton>
          </form>
          <div className="flex mt-4 text-center">
            {/* {sessions.length > 0 ? <SessionTable history={sessions} /> : ''} */}
            <SessionTable history={sessions} />
          </div>
        </div>
      </div>
    </>
  )
}
export default DatePick
