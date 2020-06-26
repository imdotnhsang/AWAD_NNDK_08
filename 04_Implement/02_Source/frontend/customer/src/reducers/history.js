import { History } from '../constants/actionTypes'

const initialState = {
	receive: {
		data: [],
		lengthData: 0,
		loading: false,
		didInvalidate: false,
		init: false,
		limit: 10,
	},
	transfer: {
		data: [],
		lengthData: 0,
		loading: false,
		didInvalidate: false,
		init: false,
		limit: 10,
	},
	debtRepaying: {
		data: [],
		lengthData: 0,
		loading: false,
		didInvalidate: false,
		init: false,
		limit: 10,
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
				lengthData: action.lengthData,
				loading: false,
				didInvalidate: false,
				init: action.init,
			}
		case History.INITIALIZED_HISTORY:
			return {
				...state,
				init: action.status,
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
		case History.LAZY_LOADING_HISTORY:
			return {
				...state,
				limit: action.limit,
			}
		default:
			return state
	}
}

const history = (state = initialState, action) => {
	switch (action.type) {
		case History.REQUEST_HISTORY_DATA:
		case History.RECEIVE_HISTORY_DATA:
		case History.INITIALIZED_HISTORY:
		case History.INVALIDATE_HISTORY_DATA:
		case History.LAZY_LOADING_HISTORY:
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
