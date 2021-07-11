/** @jsxImportSource @emotion/react */
import React from 'react'
import SVGIcon from 'assets/SVGIcon'
import { FaTimes } from 'react-icons/fa'
import { Form, Formik, ErrorMessage, useField } from 'formik'
import * as Yup from 'yup'
import * as colors from 'styles/colors'
import { useAuth } from 'context/AuthContext'
import { useFetch } from 'context/FetchContext'
import { Input, Spinner, InputwithIcon, PrimaryButton } from 'components/lib'
import { Redirect } from 'react-router-dom'
const LoginSchema = Yup.object().shape({
  name: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const FormInput = ({ ariaLabel, name, type, placeholder }) => {
  const [field] = useField(name)
  return (
    <InputwithIcon>
      <SVGIcon iconName={name} />
      <Input
        {...field}
        ariaLabel={ariaLabel}
        name={field.name}
        type={type}
        placeholder={placeholder}
      />
    </InputwithIcon>
  )
}

function Login() {
  const { setData } = useAuth()
  const [isSuccess, setIsSuccess] = React.useState()
  const [isError, setIsError] = React.useState()
  const [redirectOnLogin, setRedirectOnLogin] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { authClient } = useFetch()

  const handleSubmit = async (credentials) => {
    try {
      setIsLoading(true)
      const data = await authClient(`signin`, {
        method: 'POST',
        data: credentials,
      })
      setIsSuccess('Successfully Login!')
      setIsError(null)

      setTimeout(() => {
        setData(data)
        setRedirectOnLogin(true)
      }, 500)
    } catch (error) {
      setIsLoading(false)
      // console.log(error.response.status)
      // if (error.response.status === 403) {
      //   // await auth.logout()
      //   // console.log('csrf failed')      setTimeout(() => {
      //   setTimeout(() => {
      //     setIsError('csrf failed,refreshing client')
      //     window.location.assign(window.location)
      //     setIsSuccess(null)
      //   }, 500)
      // }
      console.log('err', error.response.data)
      setIsError(error.response.data)
      setIsSuccess(null)
    }
  }
  return (
    <>
      {redirectOnLogin && <Redirect to="/clock" />}
      <div>
        <Formik
          initialValues={{
            name: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(errors, touched) => (
            <Form>
              <div className="mb-4">
                <FormInput
                  ariaLabel="Username"
                  name="name"
                  type="text"
                  placeholder="  Username or Cellphone"
                />
                <div className="text-red-600">
                  <ErrorMessage name="name" />
                </div>
              </div>
              <div className="mb-4">
                <FormInput
                  ariaLabel="Password"
                  name="password"
                  type="password"
                  placeholder="  Password"
                />
                <div className="text-red-600">
                  <ErrorMessage name="password" />
                </div>
              </div>
              <PrimaryButton className="w-full" type="submit">
                {isLoading ? (
                  <Spinner />
                ) : isError ? (
                  <FaTimes aria-label="error" css={{ color: colors.danger }} />
                ) : (
                  <div> Log In </div>
                )}
              </PrimaryButton>
              {isSuccess ? (
                <div css={{ color: colors.green }}>
                  {/* <p>There was an error:</p> */}
                  <pre>{isSuccess}</pre>
                </div>
              ) : null}
              {isError ? (
                <div css={{ color: colors.danger }}>
                  {/* <p>There was an error:</p> */}
                  <pre>{isError}</pre>
                </div>
              ) : null}
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export { Login }
