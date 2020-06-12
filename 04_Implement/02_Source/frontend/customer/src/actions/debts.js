import { Debts } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'
import { getUrlFromCategory } from '../utils/utils'

// export const requestDebtsDataCreatedByYou = () => ({
//   type: Debts.REQUEST_DEBTS_DATA_CREATED_BY_YOU,
// })

// export const receiverDebtsDataCreatedByYou = (data) => ({
//   type: Debts.RECEIVE_DEBTS_DATA_CREATED_BY_YOU,
//   data,
// })

// export const failedRequestDebtsDataCreatedByYou = () => ({
//   type: Debts.FAILED_REQUEST_DEBTS_DATA_CREATED_BY_YOU,
// })

// export const invalidateDebtsDataCreatedByYou = () => ({
//   type: Debts.INVALIDATE_DEBTS_DATA_CREATED_BY_YOU,
// })

// const fecthDebtsDataCreatedByYou = () => async (dispatch) => {
//   dispatch(requestDebtsDataCreatedByYou())

//   const res = await api.get('/debts/created-by-you')
//   if (res.error) {
//     dispatch(failedRequestDebtsDataCreatedByYou())
//     const { error } = res
//     showError(error)
//   } else {
//     const { data } = res
//     dispatch(receiverDebtsDataCreatedByYou(data))
//   }
// }

// const shouldFetchDebtsDataCreatedByYou = (state) => {
//   const { createdByYou } = state
//   const { data, didInvalidate } = createdByYou
//   if (!data.length) return true
//   if (didInvalidate) return true
//   return false
// }

// export const fecthDebtsDataCreatedByYouIfNeeded = () => (dispatch, getState) => {
//   if (shouldFetchDebtsDataCreatedByYou(getState().debts)) {
//     return dispatch(fecthDebtsDataCreatedByYou())
//   }
//   return Promise.resolve()
// }

// export const requestDebtsDataReceivedFromOthers = () => ({
//   type: Debts.REQUEST_DEBTS_DATA_RECEIVED_FROM_OTHERS,
// })

// export const receiverDebtsDataReceivedFromOthers = (data) => ({
//   type: Debts.RECEIVE_DEBTS_DATA_RECEIVED_FROM_OTHERS,
//   data,
// })

// export const failedRequestDebtsDataReceivedFromOthers = () => ({
//   type: Debts.FAILED_REQUEST_DEBTS_DATA_RECEIVED_FROM_OTHERS,
// })

// export const invalidateDebtsDataReceivedFromOthers = () => ({
//   type: Debts.INVALIDATE_DEBTS_DATA_RECEIVED_FROM_OTHERS,
// })

// const fecthDebtsDataReceivedFromOthers = () => async (dispatch) => {
//   dispatch(requestDebtsDataReceivedFromOthers())

//   const res = await api.get('/debts/received-from-others')
//   if (res.error) {
//     dispatch(failedRequestDebtsDataReceivedFromOthers())
//     const { error } = res
//     showError(error)
//   } else {
//     const { data } = res
//     dispatch(receiverDebtsDataReceivedFromOthers(data))
//   }
// }

// const shouldFetchDebtsDataReceivedFromOthers = (state) => {
//   const { receivedFromOthers } = state
//   const { data, didInvalidate } = receivedFromOthers
//   if (!data.length) return true
//   if (didInvalidate) return true
//   return false
// }

// export const fecthDebtsDataReceivedFromOthersIfNeeded = () => (dispatch, getState) => {
//   if (shouldFetchDebtsDataReceivedFromOthers(getState().debts)) {
//     return dispatch(fecthDebtsDataReceivedFromOthers())
//   }
//   return Promise.resolve()
// }

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

const fecthDebtsData = (category) => async (dispatch) => {
	dispatch(requestDebtsData(category))

	const res = await api.get(
		`/customers/all-debt-collections/${getUrlFromCategory(category)}`
	)
	if (res.error) {
		dispatch(failedRequestDebtsData(category))
		const { error } = res
		showError(error)
	} else {
		const { data } = res
		dispatch(receiverDebtsData(category, data))
	}
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
