import axios from 'axios'

const apiURL = process.env.REACT_APP_API_URL
function Client(endpoint, {data, customHeaders, ...customConfig} = {}) {
  const config = {
    url: `${apiURL}/${endpoint}`,
    method: data ? 'POST' : 'GET',
    data: data ? JSON.stringify(data) : undefined,
    headers: {
      // Authorization: token ? `Bearer ${token}` : undefined,
      // 'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return axios(config).then(async response => {
    if (response.status === 401) {
      // await auth.logout()
      window.location.assign(window.location)
      // queryClient.clear()
      return Promise.reject({message: 'Please re-authenticate'})
    }
    const data = await response.data
    if (response.status === 200) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {Client}
