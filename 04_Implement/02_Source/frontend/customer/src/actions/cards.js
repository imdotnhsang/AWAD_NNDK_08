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
  const res = await api.get('/accounts')
  if (res.error) {
    const { error } = res
    dispatch(failedRequestCardsData())
    showError(error)
  } else {
    const { data } = res
    dispatch(receiveCardsData(data))
  }
}
