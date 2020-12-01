import React, { Component } from "react";
import "../Auth/Signin";

import requireAuth from "../Auth/requireAuth";
import SessionTable from "../SessionTable/SessionTable";

export class DatePick extends Component {
  render() {
    return (
      <div className="main-body">
        <SessionTable />
      </div>
    );
  }
}

export default requireAuth(DatePick);
