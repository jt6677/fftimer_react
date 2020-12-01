import React, { Component } from "react";
import "../Auth/Signin.css";
import { Field, Form, reduxForm } from "redux-form";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";
import requireAuth from "../Auth/requireAuth";
import SVGIcon from "../SVGIcon/SVGIcon";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import history from "../../history";
import FormR from "./FormR";
let today;
export class DatePick extends Component {
  onSubmit(formValues) {
    let datepick = `/datepick/${formValues.date}`;
    // console.log(datepick);
    console.log(formValues);
    // history.push(datepick);
    // console.log(formValues);
  }

  dateDefault() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let today = `${year}${month}${day}`;
    console.log(today);
    return `${today}`;
  }

  renderInput = (formProps) => {
    return (
      <div>
        <div className="fields">
          <label htmlFor="name">
            <SVGIcon className="icon" iconName={formProps.label} />
          </label>
          <input
            onChange={formProps.input.onChange}
            value={formProps.input.value}
            type="date"
            placeholder="asdas"
            autoComplete="off"
            dateForm="YYYYMMDD"
          />
        </div>
      </div>
    );
  };
  componentDidMount() {
    today = this.dateDefault();
  }

  render() {
    return (
      <div className="main-body">
        <Fallfowardpage showWisdom={true} />
        <form
          className=" signin-container error"
          onSubmit={this.props.handleSubmit(this.onSubmit)}
        >
          <div>
            <Field
              type="date"
              name="date"
              placeholder={"111111"}
              component={this.renderInput}
              label="calendar"
            />
          </div>
          <div className="buttonList">
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

        <div>
          <FormR />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    initialValues: {
      date: today,
    },
  };
};

const formWrapped = reduxForm({
  form: "datepickform",
})(DatePick);

export default requireAuth(connect(mapStateToProps)(formWrapped));
