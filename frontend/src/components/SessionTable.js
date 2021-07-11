import React from 'react'
import moment from 'moment'

function SessionTable({ history }) {
  const historyMap = history.map((session) => (
    <tr className="sessiontable__tr__content" key={session.ID}>
      <td className="cell">{session.id}</td>
      <td className="cell">
        {moment(session.started).format('YYYY-MM-DD HH:mm:ss')}
      </td>
      <td className="cell">
        {moment(session.finished).format('YYYY-MM-DD HH:mm:ss')}
      </td>
    </tr>
  ))

  return (
    <div className="mx-auto">
      {history.length > 0 ? (
        <table className="table sessiontable table-hover table-mc-light-blue">
          <thead>
            <tr>
              <th className="">Total: {history.length}</th>
            </tr>
            <tr>
              <th className="head">Session_ID</th>
              <th className="head">Started</th>
              <th className="head">Ended</th>
            </tr>
          </thead>
          <tbody>{historyMap}</tbody>
        </table>
      ) : (
        <div className="pt-1 text-xl">No Session Recorded</div>
      )}
    </div>
  )
}

export default SessionTable
