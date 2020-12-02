import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SVGIcon from "../SVGIcon/SVGIcon";
import "../Auth/Signin";
import { checkDailySession } from "../../actions";
import moment from "moment";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";
import requireAuth from "../Auth/requireAuth";

import { Link } from "react-router-dom";

export class DatePick extends Component {
  state = {
    selecteddate: new Date(),
  };
  handleSubmit = (evt) => {
    evt.preventDefault();
    let x = moment(this.state.selecteddate).format("YYYYMMDD");
    console.log(x);
    this.props.checkDailySession(x);
  };
  handleChange = (date) => {
    this.setState({
      selecteddate: date,
    });
  };

  render() {
    return (
      <div className="main-body">
        <Fallfowardpage showWisdom={true} />
        <form className=" signin-container" onSubmit={this.handleSubmit}>
          <label htmlFor="name">
            <SVGIcon className="icon" iconName="calendar" />
          </label>
          <DatePicker
            className="datepicker"
            selected={this.state.selecteddate}
            onChange={(e) => this.handleChange(e)}
            dateFormat="yyyyMMdd"
            isClearable
          />
          <div className="buttonList">
            <span className="errorMSG">{this.props.errorMSG}</span>
            <ul className="buttons">
              <li>
                <input
                  type="submit"
                  value="Go"
                  className="primary signinbutton"
                />
              </li>
              <li>
                <Link to="/signinandsignup" className="minor">
                  &#10229; Go back
                </Link>
              </li>
            </ul>
          </div>
        </form>
      </div>
    );
  }
}
const mapDispatchToProps = { checkDailySession };

const mapStateToProps = (state) => ({ errorMSG: state.getSession.errorMSG });
export default requireAuth(
  connect(mapStateToProps, mapDispatchToProps)(DatePick)
);
