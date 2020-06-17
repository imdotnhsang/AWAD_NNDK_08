import { Debts } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'
import { getUrlFromCategory, isAuthenticated } from '../utils/utils'
import { loginTimeout } from './timeout'

export const requestDebtsData = (category) => ({
	type: Debts.REQUEST_DEBTS_DATA,
	category,
})

export const initializedDebt = (category, status) => ({
	type: Debts.INITIALIZED_DEBTS,
	category,
	status,
})

export const receiverDebtsData = (category, data) => ({
	type: Debts.RECEIVE_DEBTS_DATA,
	category,
	data,
	// init,
})

export const failedRequestDebtsData = (category) => ({
	type: Debts.FAILED_REQUEST_DEBTS_DATA,
	category,
})

export const invalidateDebtsData = (category) => ({
	type: Debts.INVALIDATE_DEBTS_DATA,
	category,
})

const fecthDebtsData = (category) => async (dispatch, getState) => {
	dispatch(requestDebtsData(category))
	const fetchData = async (category) => {
		let currentSizeCancelled = 0
		let currentSizePaid = 0
		let currentSizeUnpaid = 0
		const { debts: debtsData } = getState()
		let currentSizes = {}
		switch (category) {
			case 'createdByYou':
				currentSizes = debtsData.createdByYou.data.reduce((object, key) => {
					object[key.debt_status] = object[key.debt_status]
						? object[key.debt_status] + 1
						: 1
					return object
				}, {})
				currentSizePaid = !debtsData.createdByYou.init
					? undefined
					: currentSizes.PAID || 0
				currentSizeUnpaid = !debtsData.createdByYou.init
					? undefined
					: currentSizes.UNPAID || 0
				currentSizeCancelled = !debtsData.createdByYou.init
					? undefined
					: currentSizes.CANCELLED || 0
				break
			case 'receivedFromOthers':
				currentSizes = debtsData.receivedFromOthers.data.reduce(
					(object, key) => {
						object[key.debt_status] = object[key.debt_status]
							? object[key.debt_status] + 1
							: 1
						return object
					},
					{}
				)
				currentSizePaid = !debtsData.receivedFromOthers.init
					? undefined
					: currentSizes.PAID || 0
				currentSizeUnpaid = !debtsData.receivedFromOthers.init
					? undefined
					: currentSizes.UNPAID || 0
				currentSizeCancelled = !debtsData.receivedFromOthers.init
					? undefined
					: currentSizes.CANCELLED || 0
				break
			default:
				break
		}
		const params = {
			currentSizeCancelled,
			currentSizePaid,
			currentSizeUnpaid,
		}
		const res = await api.get(
			`/customers/all-debt-collections/${getUrlFromCategory(category)}`,
			params
		)
		if (res.data) {
			const { data } = res
			dispatch(receiverDebtsData(category, data))
			dispatch(initializedDebt(category, true))
		} else {
			const { status, error } = res
			switch (status) {
				case 401:
					loginTimeout()(dispatch)
					showError(error)
					break
				default:
					if (status !== 204) {
						dispatch(failedRequestDebtsData(category))
						showError(error)
					}
					break
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

const shouldFetchDebtsData = (category, state) => {
	const { data, init, didInvalidate } = state[category]
	if (!init && !data.length) return true
	if (didInvalidate) return true
	return false
}

export const fecthDebtsDataIfNeeded = (category) => (dispatch, getState) => {
	if (shouldFetchDebtsData(category, getState().debts)) {
		return dispatch(fecthDebtsData(category))
	}
	return Promise.resolve()
}

export const addADebt = (data) => ({
	type: Debts.ADD_A_DEBT,
	data,
})

export const cancelADebt = (category, id, reason) => ({
	type: Debts.CANCEL_A_DEBT,
	category,
	id,
	reason,
})
