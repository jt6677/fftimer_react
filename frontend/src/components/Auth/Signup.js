import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Signin.css";
import SVGIcon from "../SVGIcon/SVGIcon";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";
import { Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { publicFetch } from "../../util/fetch";
import { Redirect } from "react-router-dom";
import FormInput from "../Input/FormInput";
// import FormSuccess from "../Input/FormSuccess";
// import FormError from "../Input/FormError";

const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Needs to Be More Than 6 digit long!")
    .required("Password is required"),
  cellphone: Yup.string()
    .min(11, "Needs to Be 11 digit long!")
    .required("Cellphone is required"),
  // firstName: Yup.string()
  // .min(2, 'Too Short!')
  // .max(50, 'Too Long!')
  // .required('Required'),
});

const Signup = () => {
  const authContext = useContext(AuthContext);
  const [signupSuccess, setSignupSuccess] = useState();
  const [signupError, setSignupError] = useState();
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);
  // const [loginLoading, setLoginLoading] = useState(false);

  const submitCredentials = async (credentials) => {
    try {
      // setLoginLoading(true);
      const { data } = await publicFetch.post(`signup`, credentials);

      if (data.hasOwnProperty("errormessage")) {
        setSignupError(data.errormessage);
      } else {
        authContext.setAuthState(data);
        setSignupSuccess(data.message);
        setSignupError("");

        setTimeout(() => {
          setRedirectOnLogin(true);
        }, 700);
      }
    } catch (error) {
      // setLoginLoading(false);
      const { data } = error.response;
      setSignupError(data.message);
      setSignupSuccess("");
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/clock" />}

      <div className="main-body">
        <Fallfowardpage showWisdom={true} />
        {signupError && <p className="errorMSG">{signupError} </p>}
        {signupSuccess && <p className="successMSG">{signupSuccess}</p>}
        <div>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={(values) => submitCredentials(values)}
            validationSchema={SignupSchema}
          >
            {(errors, touched) => (
              <Form className=" signin-container">
                <div className="errorMSG">
                  <ErrorMessage name="username" />
                </div>
                <div className="fields">
                  <label htmlFor="username">
                    <SVGIcon className="icon" iconName="user" />
                  </label>
                  <FormInput
                    ariaLabel="Username"
                    name="username"
                    type="text"
                    placeholder="username"
                  />
                </div>
                <div className="errorMSG">
                  <ErrorMessage name="cellphone" />
                </div>
                <div className="fields">
                  <label htmlFor="cellphone">
                    <SVGIcon className="icon" iconName="mobile" />
                  </label>
                  <FormInput
                    ariaLabel="Cellphone"
                    name="cellphone"
                    type="text"
                    placeholder="Cellphone"
                  />
                </div>
                <div className="errorMSG">
                  <ErrorMessage name="password" />
                </div>
                <div className="fields">
                  <label htmlFor="password">
                    <SVGIcon className="icon" iconName="password" />
                  </label>
                  <FormInput
                    ariaLabel="Password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                {/* {errors.username && touched.username ? (
                  <div>{errors.username}</div>
                ) : null} */}
                <ul className="buttons">
                  <li>
                    <input
                      className="primary signinbutton"
                      // className={
                      //   errors
                      //     ? "primary signinbutton disabled "
                      //     : "primary signinbutton"
                      // }
                      type="submit"
                      value="Sign Up"
                    />
                  </li>

                  <li>
                    <Link to="/signinandsignup" className="minor">
                      &#10229; Go back
                    </Link>
                  </li>
                </ul>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default Signup;
