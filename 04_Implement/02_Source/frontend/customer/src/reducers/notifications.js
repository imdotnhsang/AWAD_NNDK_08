import { Notifications } from '../constants/actionTypes'

const initialState = {
	data: [],
	loading: false,
	didInvalidate: false,
	init: false,
}

const notifications = (state = initialState, action) => {
	switch (action.type) {
		case Notifications.REQUEST_NOTIFICATIONS_DATA:
			return {
				...state,
				loading: true,
				didInvalidate: false,
			}
		case Notifications.RECEIVE_NOTIFICATIONS_DATA:
			return {
				...state,
				data: action.data,
				loading: false,
				didInvalidate: false,
			}
		case Notifications.INITIALIZED_NOTIFICATIONS:
			return {
				...state,
				init: action.status,
			}
		case Notifications.INVALIDATE_NOTIFICATIONS_DATA:
			return {
				...state,
				didInvalidate: true,
			}
		case Notifications.FAILED_REQUEST_NOTIFICATIONS_DATA:
			return {
				...state,
				loading: false,
				didInvalidate: false,
			}
		default:
			return state
	}
}

export default notifications
