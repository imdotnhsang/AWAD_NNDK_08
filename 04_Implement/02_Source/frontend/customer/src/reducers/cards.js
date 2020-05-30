import { Cards } from '../constants/actionTypes'

const initialState = {
  currentCard: '',
  cards: [],
  loading: false,
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
      }
    case Cards.RECEIVE_CARDS_DATA: {
      const { accountID } = action.data.find((card) => card.type === 'SAVING') || { accountID: '' }
      return {
        currentCard: accountID,
        cards: action.data,
        loading: false,
      }
    }
    case Cards.FAILED_REQUEST_CARDS_DATA:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export default cards
