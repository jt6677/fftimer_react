import React from 'react'
import { Client, GetUser } from 'utils/api-client'
import { useAsync } from 'utils/hooks'
import { FullPageSpinner } from 'components/lib'
// import UnauthenticatedApp from 'unauthenticated-app'
const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

// async function getUser() {
//   const user = GetUser
//   return user
// }
// async function getUser() {
//   const user = await Client(`me`)
//   return user
// }
const AuthProvider = (props) => {
  const logout = async () => {
    try {
      await Client(`logout`)
    } catch (err) {
      console.log(err)
    } finally {
      setData(null)
    }
  }

  const {
    data: user,
    isError,
    error,
    isLoading,
    isIdle,
    isSuccess,
    run,
    status,
    setData,
  } = useAsync()

  React.useEffect(() => {
    const userPromise = GetUser()
    run(userPromise)
  }, [run])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    console.log(error)
    const value = { user, setData }
    return <AuthContext.Provider value={value} {...props} />
    // return `${error}`
  }

  if (isSuccess) {
    const value = { user, logout, setData }
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export { AuthProvider, useAuth }
