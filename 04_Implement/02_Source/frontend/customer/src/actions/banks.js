import { Banks } from '../constants/actionTypes'
import api from '../api/api'

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
		const { errors } = res
		dispatch(failedRequestBanksData(errors))
	} else {
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

const shouldFetchBanksData = (state) => {
	const data = state.banks
	if (!data.length) return true
	return false
}

export const fetchBanksDataIfNeeded = () => (dispatch, getState) => {
	if (shouldFetchBanksData(getState().banks)) return dispatch(fetchBanksData())
	return Promise.resolve()
}
