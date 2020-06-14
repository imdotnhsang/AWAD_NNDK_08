import { Cards } from '../constants/actionTypes'
// import { getAccountIDFromStorage } from '../utils/utils'

const initialState = {
	currentCard: '',
	defaultCard: {},
	savingCards: [],
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
			const { account_id } = (action.data.savingAccounts &&
				action.data.savingAccounts[0]) || { account_id: '' }
				console.log(action.data.savingAccounts)
				console.log(action.data.defaultAccount)
			return {
				currentCard: account_id,
				defaultCard: action.data.defaultAccount,
				savingCards: action.data.savingAccounts,
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
				defaultCard: {
					...state.defaultCard,
					balance: action.balance,
				},
			}
		default:
			return state
	}
}

export default cards
