import { Receivers } from '../constants/actionTypes'

const initialState = {
  receivers: [],
  didInvalidate: false,
  loading: false,
}

const receivers = (state = initialState, action) => {
  switch (action.type) {
    case Receivers.REQUEST_RECEIVERS_DATA:
      return {
        ...state,
        didInvalidate: false,
        loading: true,
      }
    case Receivers.RECEIVE_RECEIVERS_DATA:
      return {
        receivers: action.data,
        didInvalidate: false,
        loading: false,
      }
    case Receivers.FAILED_REQUEST_RECEIVERS_DATA:
      return {
        ...state,
        loading: false,
      }
    case Receivers.INVALIDATE_RECEIVERS_DATA:
      return {
        ...state,
        didInvalidate: true,
      }
    default:
      return state
  }
}

export default receivers
