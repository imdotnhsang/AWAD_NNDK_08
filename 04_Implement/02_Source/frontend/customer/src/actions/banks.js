import { Banks } from '../constants/actionTypes'
import api from '../api/api'
import { loginTimeout } from './timeout'
import { isAuthenticated } from '../utils/utils'

export const requestBanksData = () => ({
	type: Banks.REQUEST_BANKS_DATA,
})

export const receiveBanksData = (data) => ({
	type: Banks.RECEIVE_BANKS_DATA,
	data,
})

export const failedRequestBanksData = (error) => ({
	type: Banks.FAILED_REQUEST_BANKS_DATA,
	error,
})

const fetchBanksData = () => async (dispatch) => {
	dispatch(requestBanksData())
	const res = await api.get('/linked-banks/all-linked-banks')
	if (res.errors) {
		const { errors, status } = res
		switch (status) {
			case 401:
				loginTimeout(errors)(dispatch)
				break
			default:
				if (status !== 204) {
					dispatch(failedRequestBanksData(errors))
				}
				break
		}
	} else {
		if (isAuthenticated() !== null) {
			const { data } = res
			dispatch(
				receiveBanksData([
					{
						bank_name: 'Eight Bank',
						bank_id: 'EIGHT.Bank',
					},
					...data,
				])
			)
		}
	}
}

const shouldFetchBanksData = (state) => {
	const data = state.banks
	if (data && !data.length) return true
	return false
}

export const fetchBanksDataIfNeeded = () => (dispatch, getState) => {
	if (shouldFetchBanksData(getState().banks)) return dispatch(fetchBanksData())
	return Promise.resolve()
}
