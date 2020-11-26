import React from "react";
import "./SessionTable.css";
function SessionTable({ history }) {
  const historyMap = history.map((n) => {
    return (
      <tr className="sessiontable__tr__content" key={n.id}>
        <td className="cell">{n.id}</td>
        <td className="cell">{n.started}</td>
        <td className="cell">{n.ended}</td>
      </tr>
    );
  });

  if (history.length > 0) {
    return (
      <div>
        <table className=" sessiontable table table-hover table-mc-light-blue">
          <thead>
            <tr>
              <th className="sessiontable__count">Total: {history.length}</th>
            </tr>
            <tr className="sessiontable__tr">
              <th className="head">Session_ID</th>
              <th className="head">Started</th>
              <th className="head">Ended</th>
            </tr>
          </thead>
          <tbody>{historyMap}</tbody>
          {/* <ul className="sessiontable__ul">{historyMap}</ul> */}
        </table>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default SessionTable;
