import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import './App.css'
import SigninSignup from 'components/Auth/SigninSignup'
import Signin from 'components/Auth/Signin'
import Signup from 'components/Auth/Signup'
import AppShell from './AppShell'
import { useAuth } from 'context/AuthContext'
import CountdownClock from './CountdownClock'
import DatePick from './DatePick'
const AuthenticatedRoute = ({ children, ...rest }) => {
  const { user } = useAuth()
  return (
    <Route
      {...rest}
      render={() =>
        user ? <AppShell>{children}</AppShell> : <Redirect to="/" />
      }
    ></Route>
  )
}
const UnAuthenticatedRoute = ({ children, ...rest }) => {
  const { user } = useAuth()
  return (
    <Route
      {...rest}
      render={() => (user ? <Redirect to="/clock" /> : <>{children}</>)}
    ></Route>
  )
}
function App() {
  return (
    <Router>
      <Switch>
        <UnAuthenticatedRoute path="/signin">
          <Signin />
        </UnAuthenticatedRoute>

        <UnAuthenticatedRoute path="/signup">
          <Signup />
        </UnAuthenticatedRoute>
        <UnAuthenticatedRoute exact path="/">
          <SigninSignup />
        </UnAuthenticatedRoute>

        <AuthenticatedRoute path="/clock">
          <CountdownClock />
        </AuthenticatedRoute>

        <AuthenticatedRoute path="/datepicker">
          <DatePick />
        </AuthenticatedRoute>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
