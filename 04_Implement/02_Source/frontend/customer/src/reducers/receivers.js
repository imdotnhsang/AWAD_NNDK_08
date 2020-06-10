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
    case Receivers.ADD_A_RECEIVER:
      return {
        ...state,
        receivers: [
          action.data,
          ...state.receivers,
        ],
      }
    case Receivers.EDIT_A_RECEIVER:
      return {
        ...state,
        receivers: state.receivers.map((e) => (e._id === action.data._id ? action.data : e)),
      }
    case Receivers.REMOVE_A_RECEIVER:
      return {
        ...state,
        receivers: state.receivers.filter((e) =>{ 
          console.log(e._id, action.id)
          return e._id !== action.id
        }),
      }
    default:
      return state
  }
}

export default receivers
