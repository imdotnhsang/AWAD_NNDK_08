import { History } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'
import { getUrlFromCategory } from '../utils/utils'

export const requestHistoryData = (category) => ({
  type: History.REQUEST_HISTORY_DATA,
  category,
})

export const receiverHistoryData = (category, data) => ({
  type: History.RECEIVE_HISTORY_DATA,
  category,
  data,
})

export const failedRequestHistoryData = (category) => ({
  type: History.FAILED_REQUEST_HISTORY_DATA,
  category,
})

export const invalidateHistoryData = (category) => ({
  type: History.INVALIDATE_HISTORY_DATA,
  category,
})

const fecthHistoryData = (category) => async (dispatch) => {
  dispatch(requestHistoryData(category))

  const res = await api.get(`/customers/transaction-history/${getUrlFromCategory(category)}`)
  if (res.error) {
    dispatch(failedRequestHistoryData(category))
    const { error } = res
    showError(error)
  } else {
    const { data } = res
    dispatch(receiverHistoryData(category, data))
  }
}

const shouldFetchHistoryData = (category, state) => {
  const { data, didInvalidate } = state[category]
  if (!data.length) return true
  if (didInvalidate) return true
  return false
}

export const fecthHistoryDataIfNeeded = (category) => (dispatch, getState) => {
  if (shouldFetchHistoryData(category, getState().history)) {
    return dispatch(fecthHistoryData(category))
  }
  return Promise.resolve()
}
