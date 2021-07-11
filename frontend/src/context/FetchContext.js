import React from 'react'
import axios from 'axios'
const FetchContext = React.createContext()
FetchContext.displayName = 'FecthContext'
const apiURL = process.env.REACT_APP_API_URL

const FetchProvider = (props) => {
  const csrfAxios = axios.create({
    baseURL: apiURL,
  })

  // React.useEffect(() => {
  //   const getCsrf = async () => {
  //     try {
  //       const {data} = await axios.get('/v1/csrf')
  //       csrfAxios.defaults.headers['X-CSRF-Token'] = data.csrf
  //     } catch (error) {
  //       console.log('csrf error', error)
  //       window.location.assign(window.location)
  //     }
  //   }
  //   getCsrf()
  // }, [csrfAxios])

  function authClient(endpoint, { data, customHeaders, ...customConfig } = {}) {
    const config = {
      url: `/${endpoint}`,
      method: data ? 'POST' : 'GET',
      data: data ? JSON.stringify(data) : undefined,
      headers: {
        // Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': data ? 'application/json' : undefined,
        ...customHeaders,
      },
      ...customConfig,
    }

    return csrfAxios(config).then(async (response) => {
      if (response.status === 401 && response.status === 403) {
        // await auth.logout()
        console.log('csrf failed')
        window.location.assign(window.location)
        // queryClient.clear()
        // return Promise.reject({message: 'Refresh to Get CSRF Token'})
      }
      const data = await response.data
      if (response.status >= 200 && response.status < 300) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
  }

  return <FetchContext.Provider value={{ authClient }} {...props} />
}

function useFetch() {
  const context = React.useContext(FetchContext)
  if (context === undefined) {
    throw new Error(`useFetch must be used within a FetchProvider`)
  }
  return context
}

export { FetchProvider, useFetch }
