import React from 'react'
import { Link } from 'react-router-dom'
import './Signin.css'
import SVGIcon from '../SVGIcon/SVGIcon'
import Fallfowardpage from '../FallFowardPage/fallfowardpage'
import { Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { publicFetch } from '../../util/fetch'
import { Redirect } from 'react-router-dom'
import FormInput from '../Input/FormInput'

import { useAuth } from 'context/AuthContext'

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(6, 'Needs to Be More Than 6 digit long!')
    .required('Password is required'),
  cellphone: Yup.string()
    .min(11, 'Needs to Be 11 digit long!')
    .required('Cellphone is required'),
  // firstName: Yup.string()
  // .min(2, 'Too Short!')
  // .max(50, 'Too Long!')
  // .required('Required'),
})

const Signup = () => {
  const { setData } = useAuth()
  const [isSuccess, setIsSuccess] = React.useState()
  const [isError, setIsError] = React.useState()
  const [redirectOnLogin, setRedirectOnLogin] = React.useState(false)
  // const [isLoading, setIsLoading] = React.useState(false)

  const submitCredentials = async (credentials) => {
    try {
      // setIsLoading(true)
      const { data } = await publicFetch.post(`signin`, credentials)

      setIsSuccess('Successfully Login!')
      setIsError(null)
      setTimeout(() => {
        setData(data)
        setRedirectOnLogin(true)
      }, 700)
    } catch (error) {
      // setIsLoading(false)
      setIsError(error.response.data)
      setIsSuccess(null)
    }
  }

  return (
    <>
      {redirectOnLogin && <Redirect to="/clock" />}

      <div className="main-body">
        <Fallfowardpage showWisdom={true} />
        {isError && <p className="errorMSG">{isError} </p>}
        {isSuccess && <p className="successMSG">{isSuccess}</p>}
        <div>
          <Formik
            initialValues={{
              username: '',
              password: '',
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
                <ul className="buttons">
                  <li>
                    <input
                      className="primary signinbutton"
                      type="submit"
                      value="Sign Up"
                    />
                  </li>

                  <li>
                    <Link to="/" className="minor">
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
  )
}
export default Signup
