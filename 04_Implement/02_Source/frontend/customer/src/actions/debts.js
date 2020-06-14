import { Debts } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'
import { getUrlFromCategory, isAuthenticated } from '../utils/utils'

export const requestDebtsData = (category) => ({
	type: Debts.REQUEST_DEBTS_DATA,
	category,
})

export const receiverDebtsData = (category, data) => ({
	type: Debts.RECEIVE_DEBTS_DATA,
	category,
	data,
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
				currentSizePaid = currentSizes.PAID || 0
				currentSizeUnpaid = currentSizes.UNPAID || 0
				currentSizeCancelled = currentSizes.CANCELLED || 0
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
				currentSizePaid = currentSizes.PAID || 0
				currentSizeUnpaid = currentSizes.UNPAID || 0
				currentSizeCancelled = currentSizes.CANCELLED || 0
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
		} else {
			const { status, error } = res
			if (status !== 204) {
				dispatch(failedRequestDebtsData(category))
				showError(error)
			}
		}
		isAuthenticated() && setTimeout(await fetchData(category), 15000)
	}

	isAuthenticated() && (await fetchData(category))
}

const shouldFetchDebtsData = (category, state) => {
	const { data, didInvalidate } = state[category]
	if (!data.length) return true
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
