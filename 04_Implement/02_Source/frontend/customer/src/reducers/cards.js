import { Cards } from '../constants/actionTypes'

const initialState = {
  currentCard: '',
  // cards: [],
  cards: [
    {
      service: 'MASTERCARD',
      id: '1234123412341234',
      balance: 1000000000,
      type: 'SAVING',
    },
    {
      service: 'VISA',
      id: '5678567856785678',
      balance: 1000000000,
      type: 'DEFAULT',
    },
    {
      service: 'MASTERCARD',
      id: '4321432143214321',
      balance: 1000000000,
      type: 'SAVING',
    },
    {
      service: 'MASTERCARD',
      id: '8765876587658765',
      balance: 1000000000,
      type: 'SAVING',
    },
    {
      service: 'MASTERCARD',
      id: '0987098709870987',
      balance: 1000000000,
      type: 'PAYING',
    },
    {
      service: 'MASTERCARD',
      id: '6543654365436543',
      balance: 1000000000,
      type: 'SAVING',
    },
  ],
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
      const firstSavingCard = action.data.find((card) => card.type === 'SAVING') || { id: '' }
      const currentCard = firstSavingCard.id
      return {
        currentCard,
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
