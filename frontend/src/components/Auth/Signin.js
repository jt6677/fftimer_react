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
const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Signin = () => {
  const authContext = useContext(AuthContext);
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginError, setLoginError] = useState();
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);
  // const [loginLoading, setLoginLoading] = useState(false);

  const submitCredentials = async (credentials) => {
    try {
      // setLoginLoading(true);
      const { data } = await publicFetch.post(`signin`, credentials);

      if (data.hasOwnProperty("errormessage")) {
        setLoginError(data.errormessage);
      } else {
        authContext.setAuthState(data);
        console.log(data.message);
        setLoginSuccess(data.message);
        setTimeout(() => {
          setRedirectOnLogin(true);
        }, 700);
      }
    } catch (error) {
      console.log(error);
      // setLoginLoading(false);
      // const { data } = error.response;
      setLoginError(error);
      setLoginSuccess(null);
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/clock" />}

      <div className="main-body">
        <Fallfowardpage showWisdom={true} />
        {loginError && <p className="errorMSG">{loginError} </p>}
        {loginSuccess && <p className="successMSG">{loginSuccess}</p>}
        <div>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={(values) => submitCredentials(values)}
            validationSchema={LoginSchema}
          >
            {(errors, touched) => (
              <Form className=" signin-container">
                {/* {loginSuccess && <FormSuccess text={loginSuccess} />} */}
                <div className="errorMSG">
                  <ErrorMessage name="username" />
                </div>
                <div className="fields">
                  <label htmlFor="name">
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
                  <ErrorMessage name="password" />
                </div>
                <div className="fields">
                  <label htmlFor="name">
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
                      value="Log In"
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

export default Signin;
