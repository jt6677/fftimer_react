import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FullPageErrorFallback } from 'components/lib'
import { AuthProvider } from 'context/AuthContext'
import { FetchProvider } from 'context/FetchContext'
import { BrowserRouter as Router } from 'react-router-dom'

function AppProvider({ children }) {
  return (
    <FetchProvider>
      <Router>
        <AuthProvider>
          <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </Router>
    </FetchProvider>
  )
}
export { AppProvider }
