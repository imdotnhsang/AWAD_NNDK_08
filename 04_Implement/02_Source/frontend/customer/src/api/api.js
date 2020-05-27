import axios from 'axios'
import querystring from 'querystring'
import { getJwtFromStorage, objectToQueryString } from '../utils/utils'

export const host = 'https://mock-api-eight-bank.herokuapp.com'
export const apiHost = `${host}/api/`
const authType = 'Bearer'

const instance = axios.create({
  baseURL: apiHost,
})

const api = {
  get: (url, params) => {
    // eslint-disable-next-line prefer-const
    let options = {}

    if (params) {
      // eslint-disable-next-line no-param-reassign
      url += url + objectToQueryString(params)
    }
    // const jwt = getJwtFromStorage();
    // if (jwt) {
    //   options.headers.Authorization = `${authType} ${jwt}`;
    // }

    return instance.get(`${url}`, options)
  },
  post: (url, data, config) => {
    let options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (config) {
      options = { ...options, ...config }
    }

    // const jwt = getJwtFromStorage();
    // if (jwt) {
    //   options.headers.Authorization = `${authType} ${jwt}`;
    // }

    return instance.post(`${url}`, querystring.stringify(data), options)
  },
}

export default api
