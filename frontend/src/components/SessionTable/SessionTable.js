import React from 'react'
import './SessionTable.css'
import moment from 'moment'

function SessionTable({ history }) {
  const historyMap = history.map((session) => (
    <tr className="sessiontable__tr__content" key={session.ID}>
      <td className="cell">{session.ID}</td>
      <td className="cell">{session.StartedAt}</td>
      <td className="cell">
        {moment(session.UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}
      </td>
    </tr>
  ))

  return (
    <div className="mx-auto">
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
    </div>
  )
}

export default SessionTable
