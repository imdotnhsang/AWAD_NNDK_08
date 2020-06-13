import axios from 'axios'
// import querystring from 'querystring'
import {
	// getJwtFromStorage,
	objectToQueryString,
	generateErrorResponse,
} from '../utils/utils'

// export const host = 'https://mock-api-eight-bank.herokuapp.com'

export const host = 'http://localhost:5000'
export const apiHost = `${host}/`
// const authType = 'Bearer'

const instance = axios.create({
	baseURL: apiHost,
	timeout: 15000,
})

const api = {
	get: async (url, params) => {
		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		}

		if (params) {
			// eslint-disable-next-line no-param-reassign
			url += `?${objectToQueryString(params)}`
		}

		try {
			const response = await instance.get(`${url}`, options)
			if (response.status === 200) {
				return response.data
			}
			return generateErrorResponse(response)
		} catch (e) {
			return generateErrorResponse(e.response)
		}
	},
	post: async (url, data, config) => {
		let options = {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		}

		if (config) {
			options = { ...options, ...config }
		}

		try {
			const response = await instance.post(
				`${url}`,
				JSON.stringify(data),
				options
			)
			return response.data
		} catch (e) {
			return generateErrorResponse(e.response)
		}
	},
	delete: async (url, params) => {
		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		}

		if (params) {
			// eslint-disable-next-line no-param-reassign
			url += `?${objectToQueryString(params)}`
		}

		try {
			const response = await instance.delete(`${url}`, options)
			return response.data
		} catch (e) {
			return generateErrorResponse(e.response)
		}
	},
	put: async (url, data, config) => {
		let options = {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		}

		if (config) {
			options = { ...options, ...config }
		}

		try {
			const response = await instance.put(
				`${url}`,
				JSON.stringify(data),
				options
			)
			return response.data
		} catch (e) {
			return generateErrorResponse(e.response)
		}
	},
}

export default api
