import axios from 'axios'
import querystring from 'querystring'
import { getJwtFromStorage, objectToQueryString, generateErrorResponse } from '../utils/utils'

export const host = 'https://mock-api-eight-bank.herokuapp.com'

// export const host = 'http://localhost:3002'
export const apiHost = `${host}/api/`
const authType = 'Bearer'

const instance = axios.create({
  baseURL: apiHost,
})

const api = {
  get: async (url, params) => {
    // eslint-disable-next-line prefer-const
    let options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (params) {
      // eslint-disable-next-line no-param-reassign
      url += url + objectToQueryString(params)
    }
    const jwt = getJwtFromStorage()
    if (jwt) {
      options.headers.Authorization = `${authType} ${jwt}`
    }

    try {
      const response = await instance.get(`${url}`, options)
      return response.data
    } catch (e) {
      return generateErrorResponse(e.response)
    }
  },
  post: async (url, data, config) => {
    let options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (config) {
      options = { ...options, ...config }
    }

    const jwt = getJwtFromStorage()
    if (jwt) {
      options.headers.Authorization = `${authType} ${jwt}`
    }

    try {
      const response = await instance.post(`${url}`, querystring.stringify(data), options)
      return response.data
    } catch (e) {
      return generateErrorResponse(e.response)
    }
  },
  delete: async (url, data, config) => {
    let options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (config) {
      options = { ...options, ...config }
    }

    const jwt = getJwtFromStorage()
    if (jwt) {
      options.headers.Authorization = `${authType} ${jwt}`
    }

    try {
      const response = await instance.delete(`${url}`, querystring.stringify(data), options)
      return response.data
    } catch (e) {
      return generateErrorResponse(e.response)
    }
  },
}

export default api
