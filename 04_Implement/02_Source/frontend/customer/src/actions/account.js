import { Account } from '../constants/actionTypes'
import api from '../api/api'
import { loginTimeout } from './timeout'

export const requestAccountData = () => ({
	type: Account.REQUEST_ACCOUNT_DATA,
})

export const receiveAccountData = (data) => ({
	type: Account.RECEIVE_ACCOUNT_DATA,
	data,
})

export const failedRequestAccountData = (error) => ({
	type: Account.FAILED_REQUEST_ACCOUNT_DATA,
	error,
})

const fetchAccountData = () => async (dispatch) => {
	dispatch(requestAccountData())
	const res = await api.get('/customers/personal-info')
	if (res.error) {
		const { error, status } = res
		switch (status) {
			case 401:
				loginTimeout(error)(dispatch)
				break
			default:
				if (status !== 204) {
					dispatch(failedRequestAccountData(error))
				}
				break
		}
	} else {
		const { data } = res
		dispatch(receiveAccountData(data))
	}
}

const shouldFetchAccountData = (state) => {
	const data = state.account
	if (!data.name) return true
	return false
}

export const fetchAccountDataIfNeeded = () => (dispatch, getState) => {
	if (shouldFetchAccountData(getState().account))
		return dispatch(fetchAccountData())
	return Promise.resolve()
}
