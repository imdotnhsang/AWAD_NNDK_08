import { Banks } from '../constants/actionTypes'

const initialState = {
  banks: [],
  loading: false,
  error: '',
}

const banks = (state = initialState, action) => {
  switch (action.type) {
    case Banks.REQUEST_BANKS_DATA:
      return {
        ...state,
        loading: true,
        error: '',
      }
    case Banks.RECEIVE_BANKS_DATA:
      return {
        ...state,
        banks: action.data,
        loading: false,
        error: '',
      }
    case Banks.FAILED_REQUEST_BANKS_DATA:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    default:
      return state
  }
}
export default banks
