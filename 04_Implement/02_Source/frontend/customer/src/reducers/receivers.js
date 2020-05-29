import { Receivers } from '../constants/actionTypes'

const initialState = {
  receivers: [],
  loading: false,
}

const receivers = (state = initialState, action) => {
  switch (action.type) {
    case Receivers.REQUEST_RECEIVERS_DATA:
      return {
        ...state,
        loading: true,
      }
    case Receivers.RECEIVE_RECEIVERS_DATA:
      return {
        receivers: action.data,
        loading: false,
      }
    case Receivers.FAILED_REQUEST_RECEIVERS_DATA:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export default receivers
