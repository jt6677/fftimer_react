import React from 'react'

import { Client } from 'util/api-client'
import { useAsync } from 'util/hooks'
const AuthContext = React.createContext()

AuthContext.displayName = 'AuthContext'
async function getUser() {
  const { username: user } = await Client(`me`)
  return user
}

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

  const [sessiontableState, setSessiontableState] = React.useState([])
  const {
    data: user,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    status,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  if (isLoading || isIdle) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div>Error, Please reload...</div>
  }

  if (isSuccess) {
    const value = {
      user,
      logout,
      setData,
      sessiontableState,
      setSessiontableState,
    }
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
