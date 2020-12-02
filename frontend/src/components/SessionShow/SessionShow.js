import React, { Component } from "react";
import "../Auth/Signin";
import { connect } from "react-redux";
import requireAuth from "../Auth/requireAuth";
import SessionTable from "../SessionTable/SessionTable";

export class SessionShow extends Component {
  render() {
    return (
      <div className="main-body">
        {/* <h1>Some Data</h1>
        <h1>
          {this.props.sessions.map((session) => {
            return (
              <div>
                <ul>
                  <li>{session.ID}</li>
                  <li>{session.CreatedAt}</li>
                  <li>{session.UpdatedAt}</li>
                </ul>
              </div>
            );
          })}
        </h1> */}
        <SessionTable history={this.props.sessions} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { sessions: state.getSession.sessions };
};

export default requireAuth(connect(mapStateToProps)(SessionShow));
