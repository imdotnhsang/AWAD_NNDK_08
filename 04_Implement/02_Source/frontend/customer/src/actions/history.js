import { History } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'
import { getUrlFromCategory, isAuthenticated } from '../utils/utils'
import { loginTimeout } from './timeout'

export const requestHistoryData = (category) => ({
	type: History.REQUEST_HISTORY_DATA,
	category,
})

export const receiverHistoryData = (category, data, lengthData) => ({
	type: History.RECEIVE_HISTORY_DATA,
	category,
	data,
	lengthData,
	// init,
})

export const initializedHistory = (category, status) => ({
	type: History.INITIALIZED_HISTORY,
	category,
	status,
})

export const failedRequestHistoryData = (category) => ({
	type: History.FAILED_REQUEST_HISTORY_DATA,
	category,
})

export const invalidateHistoryData = (category) => ({
	type: History.INVALIDATE_HISTORY_DATA,
	category,
})

export const lazyLoadingHistoryData = (category, limit) => ({
	type: History.LAZY_LOADING_HISTORY,
	category,
	limit,
})

const fecthHistoryData = (category, limit) => async (dispatch, getState) => {
	dispatch(requestHistoryData(category))
	const fetchData = async (category, limit) => {
		let currentSizeHistory = 0
		const { history: historyData } = getState()
		switch (category) {
			case 'receive':
				currentSizeHistory = !historyData.receive.init
					? undefined
					: historyData.receive.lengthData
				break
			case 'transfer':
				currentSizeHistory = !historyData.transfer.init
					? undefined
					: historyData.transfer.lengthData
				break
			case 'debtRepaying':
				currentSizeHistory = !historyData.debtRepaying.init
					? undefined
					: historyData.debtRepaying.lengthData
				break
			default:
				break
		}

		const params = { currentSizeHistory, limit }
		const res = await api.get(
			`/customers/transaction-history/${getUrlFromCategory(category)}`,
			params
		)
		if (res.data) {
			const { data, length: lengthData } = res
			dispatch(receiverHistoryData(category, data, lengthData))
			dispatch(initializedHistory(category, true))
			dispatch(lazyLoadingHistoryData(category, limit))
		} else {
			const { status, error } = res
			switch (status) {
				case 401:
					loginTimeout(error)(dispatch)
					break
				default:
					if (status !== 204) {
						dispatch(failedRequestHistoryData(category))
						showError(error)
					}
					break
			}
		}

		let limitHistory = 0
		const { history: newHistoryData } = getState()
		switch (category) {
			case 'receive':
				limitHistory = newHistoryData.receive.limit
				break
			case 'transfer':
				limitHistory = newHistoryData.transfer.limit
				break
			case 'debtRepaying':
				limitHistory = newHistoryData.debtRepaying.limit
				break
			default:
				break
		}
		console.log(limit, limitHistory)
		let timeout
		if (isAuthenticated() !== null && limitHistory === limit) {
			timeout = setTimeout(await fetchData(category), 15000)
		} else {
			clearTimeout(timeout)
		}
	}

	isAuthenticated() && (await fetchData(category, limit))
}

const shouldFetchHistoryData = (category, state) => {
	const { data, init, didInvalidate } = state[category]
	if (!init && !data.length) return true
	if (didInvalidate) return true
	return false
}

export const fecthHistoryDataIfNeeded = (category, limit) => (
	dispatch,
	getState
) => {
	if (shouldFetchHistoryData(category, getState().history)) {
		return dispatch(fecthHistoryData(category, limit))
	}
	return Promise.resolve()
}
