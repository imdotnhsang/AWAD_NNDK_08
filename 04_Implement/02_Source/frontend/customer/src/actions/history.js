import { History } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'
import { getUrlFromCategory, isAuthenticated } from '../utils/utils'

export const requestHistoryData = (category) => ({
	type: History.REQUEST_HISTORY_DATA,
	category,
})

export const receiverHistoryData = (category, data, init) => ({
	type: History.RECEIVE_HISTORY_DATA,
	category,
	data,
	init,
})

export const failedRequestHistoryData = (category) => ({
	type: History.FAILED_REQUEST_HISTORY_DATA,
	category,
})

export const invalidateHistoryData = (category) => ({
	type: History.INVALIDATE_HISTORY_DATA,
	category,
})

const fecthHistoryData = (category) => async (dispatch, getState) => {
	dispatch(requestHistoryData(category))
	const fetchData = async (category) => {
		let currentSizeHistory = 0
		const { history: historyData } = getState()
		switch (category) {
			case 'receive':
				currentSizeHistory = !historyData.receive.init
					? undefined
					: historyData.receive.data.length || 0
				break
			case 'transfer':
				currentSizeHistory = !historyData.transfer.init
					? undefined
					: historyData.transfer.data.length || 0
				break
			case 'debtRepaying':
				currentSizeHistory = !historyData.debtRepaying.init
					? undefined
					: historyData.debtRepaying.data.length || 0
				break
			default:
				break
		}
		const params = { currentSizeHistory }
		const res = await api.get(
			`/customers/transaction-history/${getUrlFromCategory(category)}`,
			params
		)
		if (res.data) {
			const { data } = res
			dispatch(receiverHistoryData(category, data, true))
		} else {
			const { status, error } = res
			if (status !== 204) {
				dispatch(failedRequestHistoryData(category))
				showError(error)
			}
		}
		let timeout
		if (isAuthenticated() !== null) {
			timeout = setTimeout(await fetchData(category), 15000)
		} else {
			clearTimeout(timeout)
		}
	}

	isAuthenticated() && (await fetchData(category))
}

const shouldFetchHistoryData = (category, state) => {
	const { data, init, didInvalidate } = state[category]
	if (!init && !data.length) return true
	if (didInvalidate) return true
	return false
}

export const fecthHistoryDataIfNeeded = (category) => (dispatch, getState) => {
	if (shouldFetchHistoryData(category, getState().history)) {
		return dispatch(fecthHistoryData(category, getState().history))
	}
	return Promise.resolve()
}
