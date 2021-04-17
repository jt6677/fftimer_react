import React from 'react'
import { Link } from 'react-router-dom'
import './Signin.css'
import SVGIcon from '../SVGIcon/SVGIcon'
import Fallfowardpage from '../FallFowardPage/fallfowardpage'
import { Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAuth } from 'context/AuthContext'
import { publicFetch } from '../../util/fetch'
import { Redirect } from 'react-router-dom'
import FormInput from '../Input/FormInput'
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const Signin = () => {
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
        console.log(data.username)
        setRedirectOnLogin(true)
        setData(data.username)
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
            validationSchema={LoginSchema}
          >
            {(errors, touched) => (
              <Form className=" signin-container">
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
                <ul className="buttons">
                  <li>
                    <input
                      className="primary signinbutton"
                      type="submit"
                      value="Log In"
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

export default Signin
