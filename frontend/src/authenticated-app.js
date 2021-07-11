/** @jsxImportSource @emotion/react */
import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
  SecondaryButton,
  ErrorMessage,
  FullPageErrorFallback,
} from 'components/lib'
import { ErrorBoundary } from 'react-error-boundary'
import { useAuth } from 'context/AuthContext'
// import * as colors from './styles/colors'
// import * as mq from './styles/media-queries'
import DatePick from './components/DatePick'
import Navbar from './components/Navbar'
import CountdownClock from './components/CountdownClock'
import { NotFoundScreen } from './screens/not-found'
function ErrorFallback({ error }) {
  return (
    <ErrorMessage
      error={error}
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}

function AuthenticatedApp() {
  // const { logout, user } = useAuth()

  // function handleClick() {
  //   logout()
  // }
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <Navbar />
      <AppRoutes />
    </ErrorBoundary>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact render={() => <CountdownClock />} />
      <Route path="/clock" render={() => <CountdownClock />} />
      <Route path="/datepicker" render={() => <DatePick />} />
      <Route path="*" render={() => <NotFoundScreen />} />
    </Switch>
  )
}

export default AuthenticatedApp
