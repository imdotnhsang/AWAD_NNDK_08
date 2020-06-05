import { Debts } from '../constants/actionTypes'
import { DebtStatus } from '../constants/constants'

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
const tab = (state, action) => {
  switch (action.type) {
    case Debts.REQUEST_DEBTS_DATA:
      return {
        ...state,
        loading: true,
        didInvalidate: false,
      }
    case Debts.RECEIVE_DEBTS_DATA:
      return {
        ...state,
        data: action.data,
        loading: false,
        didInvalidate: false,
      }
    case Debts.INVALIDATE_DEBTS_DATA:
      return {
        ...state,
        didInvalidate: true,
      }
    case Debts.FAILED_REQUEST_DEBTS_DATA:
      return {
        ...state,
        loading: false,
        didInvalidate: false,
      }
    case Debts.CANCEL_A_DEBT:
      return {
        ...state,
        data: state.data.map((debt) => (debt.id === action.id
          ? ({
            ...debt,
            status: DebtStatus.CANCELLED,
          })
          : debt)),
      }
    case Debts.ADD_A_DEBT:
      return {
        ...state,
        data: [
          action.data,
          ...state.data,
        ],
      }
    default:
      return state
  }
}
const debts = (state = initialState, action) => {
  switch (action.type) {
    case Debts.REQUEST_DEBTS_DATA:
    case Debts.RECEIVE_DEBTS_DATA:
    case Debts.FAILED_REQUEST_DEBTS_DATA:
    case Debts.INVALIDATE_DEBTS_DATA:
    case Debts.CANCEL_A_DEBT:
      return {
        ...state,
        [action.category]: tab(state[action.category], action),
      }
    case Debts.ADD_A_DEBT:
      return {
        ...state,
        createdByYou: tab(state.createdByYou, action),
      }
    default:
      return state
  }
}

export default debts
