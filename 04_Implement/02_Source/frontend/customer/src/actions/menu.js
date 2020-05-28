import { Menu } from '../constants/actionTypes'

// eslint-disable-next-line import/prefer-default-export
export const selectTab = (value) => ({
  type: Menu.SELECT_TAB,
  value,
})
