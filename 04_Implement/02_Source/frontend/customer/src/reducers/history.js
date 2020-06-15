import { History } from '../constants/actionTypes'

const initialState = {
	receive: {
		data: [],
		loading: false,
		didInvalidate: false,
		init: false,
	},
	transfer: {
		data: [],
		loading: false,
		didInvalidate: false,
		init: false,
	},
	debtRepaying: {
		data: [],
		loading: false,
		didInvalidate: false,
		init: false,
	},
}
const tab = (state, action) => {
	switch (action.type) {
		case History.REQUEST_HISTORY_DATA:
			return {
				...state,
				loading: true,
				didInvalidate: false,
			}
		case History.RECEIVE_HISTORY_DATA:
			return {
				...state,
				data: action.data,
				loading: false,
				didInvalidate: false,
				init: action.init,
			}
		case History.INVALIDATE_HISTORY_DATA:
			return {
				...state,
				didInvalidate: true,
			}
		case History.FAILED_REQUEST_HISTORY_DATA:
			return {
				...state,
				loading: false,
				didInvalidate: false,
			}
		default:
			return state
	}
}

const history = (state = initialState, action) => {
	switch (action.type) {
		case History.REQUEST_HISTORY_DATA:
		case History.RECEIVE_HISTORY_DATA:
		case History.INVALIDATE_HISTORY_DATA:
		case History.FAILED_REQUEST_HISTORY_DATA:
			return {
				...state,
				[action.category]: tab(state[action.category], action),
			}
		default:
			return state
	}
}

export default history
