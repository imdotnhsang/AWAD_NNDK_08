import { Cards } from '../constants/actionTypes'
import { getAccountIDFromStorage } from '../utils/utils'

const initialState = {
  currentCard: '',
  cards: [],
  loading: false,
  didInvalidate: false,
}

const cards = (state = initialState, action) => {
  switch (action.type) {
    case Cards.SELECT_CARD:
      return {
        ...state,
        currentCard: action.value,
      }
    case Cards.REQUEST_CARDS_DATA:
      return {
        ...state,
        loading: true,
        didInvalidate: false,
      }
    case Cards.RECEIVE_CARDS_DATA: {
      const { accountID } = action.data.find((card) => card.type === 'SAVING') || { accountID: '' }
      return {
        currentCard: accountID,
        cards: action.data,
        loading: false,
        didInvalidate: false,
      }
    }
    case Cards.INVALIDATE_CARDS_DATA: {
      return {
        ...state,
        didInvalidate: true,
      }
    }
    case Cards.FAILED_REQUEST_CARDS_DATA:
      return {
        ...state,
        loading: false,
        didInvalidate: false,
      }
    case Cards.UPDATE_DEFAULT_CARD_BALANCE:
      return {
        ...state,
        cards: state.cards.map((card) => (card.accountID === getAccountIDFromStorage()
          ? ({
            ...card,
            balance: action.balance,
          })
          : card)),
      }
    default:
      return state
  }
}

export default cards
