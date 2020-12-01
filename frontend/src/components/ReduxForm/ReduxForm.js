import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import SVGIcon from "../SVGIcon/SVGIcon";
import "./ReduxForm.css";

export class ReduxForm extends Component {
  onSubmit = (formValues) => {
    this.props.onSubmit(formValues);
  };

  renderInput = (formProps) => {
    // const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    // console.log(formProps);
    // console.log(formProps);
    return (
      // <div className={className}>
      <input
        onChange={formProps.input.onChange}
        value={formProps.input.value}
        type={formProps.type}
        placeholder={formProps.placeholder}
        autoComplete="off"
        displayFormat="YYYYMMDD"
      />
    );
  };
  render() {
    return (
      <form
        className=" signin-container"
        onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <div>
          <div className="field signin">
            <label htmlFor="calendar">
              <SVGIcon className="icon" iconName="calendar" />
            </label>
            <Field
              name="date"
              type="date"
              placeholder="Calendar"
              component={this.renderInput}
            />
          </div>
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
    );
  }
}

export default reduxForm({
  form: "datepickform",
})(ReduxForm);
