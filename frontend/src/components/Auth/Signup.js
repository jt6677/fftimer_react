import React, { Component } from "react";
import "./Signin.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SVGIcon from "../SVGIcon/SVGIcon";

import { signUp } from "../../actions";
import { Field, reduxForm } from "redux-form";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";

const required = (value) =>
  value || typeof value === "number" ? undefined : "Required";
export const minLength = (min) => (value) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minLength4 = minLength(4);
export const minLength6 = minLength(6);
export const minLength11 = minLength(11);

export class Signup extends Component {
  onSubmit = (formValues) => {
    this.props.signUp(formValues);
  };

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
            type={formProps.type}
            placeholder={formProps.placeholder}
            autoComplete="off"
          />
        </div>
        <div className="errorMSG">
          {formProps.meta.touched && formProps.meta.error && (
            <span>{formProps.meta.error}</span>
          )}
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="main-body">
        <Fallfowardpage />
        <div>
          <form
            className="signin-container"
            onSubmit={this.props.handleSubmit(this.onSubmit)}
          >
            <div>
              <Field
                type="text"
                name="username"
                placeholder="Username"
                component={this.renderInput}
                validate={[required, minLength4]}
                label="user"
              />

              <Field
                type="text"
                name="cellphone"
                placeholder="Cellphone"
                component={this.renderInput}
                validate={[required, minLength11]}
                label="mobile"
              />

              <Field
                type="password"
                name="password"
                placeholder="Password"
                component={this.renderInput}
                validate={[required, minLength6]}
                label="password"
              />
            </div>
            <div className="buttonList">
              <div>{this.props.errorMessage}</div>
              <ul className="buttons">
                <li>
                  <input
                    className={
                      // || this.props.submitting
                      this.props.pristine || this.props.submitting
                        ? "primary signinbutton disabled "
                        : "primary signinbutton "
                    }
                    type="submit"
                    value="Log In"
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
      </div>
    );
  }
}

const formWrapped = reduxForm({
  form: "signupform",
})(Signup);

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
});
const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(formWrapped);
