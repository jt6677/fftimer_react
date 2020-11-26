import React, { Component } from "react";
import "./Signin.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SVGIcon from "../SVGIcon/SVGIcon";

import { signIn } from "../../actions";
import { Field, reduxForm } from "redux-form";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";

const required = (value) =>
  value || typeof value === "number" ? undefined : "Required";
export const minLength = (min) => (value) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minLength4 = minLength(4);
export const minLength6 = minLength(6);

export class Signin extends Component {
  onSubmit = (formValues) => {
    this.props.signIn(formValues);
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
        <Fallfowardpage showWisdom={true} />
        <div>
          <form
            className=" signin-container error"
            onSubmit={this.props.handleSubmit(this.onSubmit)}
          >
            <div>
              <Field
                type="text"
                name="username"
                placeholder="Username or Cellphone"
                component={this.renderInput}
                validate={[required, minLength4]}
                label="user"
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
              <div className="errorMSG">{this.props.errorMessage}</div>
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

// const formUsername= formValues("username")
const formWrapped = reduxForm({
  form: "signinform",
})(Signin);

// const formSelected = (state) => {
//   const usernameValue = selector(state, "username");
//   const passwordValue = selector(state, "password");
//   return {
//     usernameValue,
//     passwordValue,
//   };
// };

const mapStateToProps = (state) => {
  return { errorMessage: state.auth.errorMessage };
};

const mapDispatchToProps = { signIn };

export default connect(mapStateToProps, mapDispatchToProps)(formWrapped);
