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

export const failedRequestCardsData = () => ({
  type: Cards.FAILED_REQUEST_CARDS_DATA,
})

export const fetchCardsData = () => async (dispatch) => {
  dispatch(requestCardsData())
  try {
    const response = await api.get('/accounts')
    const { data } = response.data
    dispatch(receiveCardsData(data))
  } catch (e) {
    const { data } = e.response || { data: { error: 'Something wrong happended ...' } }
    const { error } = data
    dispatch(failedRequestCardsData())
    showError(error)
  }
}
