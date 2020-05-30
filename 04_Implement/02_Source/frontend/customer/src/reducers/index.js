import { combineReducers } from 'redux'
import cards from './cards'
import receivers from './receivers'
import banks from './banks'

export default combineReducers({
  cards, receivers, banks,
})
