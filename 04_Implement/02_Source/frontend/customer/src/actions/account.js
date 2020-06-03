import { Account } from '../constants/actionTypes'
import api from '../api/api'

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
  const res = await api.get('/account')
  if (res.error) {
    const { error } = res
    dispatch(failedRequestAccountData(error))
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
  if (shouldFetchAccountData(getState().account)) return dispatch(fetchAccountData())
  return Promise.resolve()
}
