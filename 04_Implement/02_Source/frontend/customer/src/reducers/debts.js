import { Debts } from '../constants/actionTypes'

const initialState = {
  createdByYou: {
    data: [],
    didInvalidate: false,
    loading: false,
  },
  receivedFromOthers: {
    data: [],
    didInvalidate: false,
    loading: false,
  },
}

const debts = (state = initialState, action) => {
  switch (action.type) {
    case Debts.REQUEST_DEBTS_DATA_CREATED_BY_YOU:
      return {
        ...state,
        createdByYou: {
          ...state.createdByYou,
          loading: true,
          didInvalidate: false,
        },
      }
    case Debts.RECEIVE_DEBTS_DATA_CREATED_BY_YOU:
      return {
        ...state,
        createdByYou: {
          data: action.data,
          loading: false,
          didInvalidate: false,
        },
      }
    case Debts.FAILED_REQUEST_DEBTS_DATA_CREATED_BY_YOU:
      return {
        ...state,
        createdByYou: {
          loading: false,
          didInvalidate: false,
        },
      }
    case Debts.INVALIDATE_DEBTS_DATA_CREATED_BY_YOU:
      return {
        ...state,
        createdByYou: {
          ...state.createdByYou,
          didInvalidate: true,
        },
      }
    case Debts.REQUEST_DEBTS_DATA_RECEIVED_FROM_OTHERS:
      return {
        ...state,
        receivedFromOthers: {
          ...state.receivedFromOthers,
          loading: true,
          didInvalidate: false,
        },
      }
    case Debts.RECEIVE_DEBTS_DATA_RECEIVED_FROM_OTHERS:
      return {
        ...state,
        receivedFromOthers: {
          data: action.data,
          loading: false,
          didInvalidate: false,
        },
      }
    case Debts.FAILED_REQUEST_DEBTS_DATA_RECEIVED_FROM_OTHERS:
      return {
        ...state,
        receivedFromOthers: {
          loading: false,
          didInvalidate: false,
        },
      }
    case Debts.INVALIDATE_DEBTS_DATA_RECEIVED_FROM_OTHERS:
      return {
        ...state,
        receivedFromOthers: {
          ...state.receivedFromOthers,
          didInvalidate: true,
        },
      }
    default:
      return state
  }
}

export default debts
