import { Menu } from '../constants/actionTypes'

const initialState = {
  currentTab: 0,
}

const menu = (state = initialState, action) => {
  switch (action.type) {
    case Menu.SELECT_TAB:
      return {
        ...state,
        currentTab: action.value,
      }
    default:
      return state
  }
}
export default menu
