import { Cards } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'

export const selectCard = (value) => ({
	type: Cards.SELECT_CARD,
	value,
})

export const requestCardsData = () => ({
	type: Cards.REQUEST_CARDS_DATA,
})

export const receiveCardsData = (data) => ({
	type: Cards.RECEIVE_CARDS_DATA,
	data,
})

export const invalidateCardsData = () => ({
	type: Cards.INVALIDATE_CARDS_DATA,
})

export const failedRequestCardsData = () => ({
	type: Cards.FAILED_REQUEST_CARDS_DATA,
})

const fetchCardsData = () => async (dispatch) => {
	dispatch(requestCardsData())
	const res = await api.get('/customers/all-accounts')
	if (res.error) {
		const { error } = res
		dispatch(failedRequestCardsData())
		showError(error)
	} else {
		const { data } = res
		dispatch(receiveCardsData(data))
	}
}

const shouldFetchCardsData = (state) => {
	const {
		savingCards: savingData,
		defaultCard: defaultData,
		didInvalidate,
	} = state
	if (!savingData.length || !defaultData) return true
	if (didInvalidate) return true
	return false
}

export const fetchCardsDataIfNeeded = () => (dispatch, getState) => {
	// console.log(getState())
	if (shouldFetchCardsData(getState().cards)) return dispatch(fetchCardsData())
	return Promise.resolve()
}

export const updateDefaultCardBalance = (balance) => ({
	type: Cards.UPDATE_DEFAULT_CARD_BALANCE,
	balance,
})
