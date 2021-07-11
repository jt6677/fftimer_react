/** @jsxImportSource @emotion/react */
import React from 'react'
import { useAuth } from 'context/AuthContext'
import { FullPageSpinner } from 'components/lib'
import UnauthenticatedApp from './unauthenticated-app'
import AuthenticatedApp from './authenticated-app'
// const AuthenticatedApp = React.lazy(() =>
//   import(/*webpackPrefetch:true*/ './authenticated-app')
// )

// const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))
function App() {
  const { user } = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
  // return (
  //   <React.Suspense fallback={<FullPageSpinner />}>
  //     <UnauthenticatedApp />
  //   </React.Suspense>
  // )
}
export default App
