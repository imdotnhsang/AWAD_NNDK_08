import { combineReducers } from 'redux'
import cards from './cards'
import receivers from './receivers'
import banks from './banks'
import debts from './debts'

export default combineReducers({
  cards, receivers, banks, debts,
})
