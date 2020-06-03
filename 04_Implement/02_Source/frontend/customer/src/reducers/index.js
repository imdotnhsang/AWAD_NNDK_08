import { combineReducers } from 'redux'
import cards from './cards'
import receivers from './receivers'
import banks from './banks'
import debts from './debts'
import history from './history'

export default combineReducers({
  cards, receivers, banks, debts, history,
})
