import { Notifications } from '../constants/actionTypes'
import api from '../api/api'
import { showError } from '../components/common/presentational/Error'
import { isAuthenticated } from '../utils/utils'
import { loginTimeout } from './timeout'

export const requestNotificationsData = () => ({
	type: Notifications.REQUEST_NOTIFICATIONS_DATA,
})
export const initializedNotification = (status) => ({
	type: Notifications.INITIALIZED_NOTIFICATIONS,
	status,
})

export const receiverNotificationsData = (data) => ({
	type: Notifications.RECEIVE_NOTIFICATIONS_DATA,
	data,
	// init,
})

export const failedRequestNotificationsData = () => ({
	type: Notifications.FAILED_REQUEST_NOTIFICATIONS_DATA,
})

export const invalidateNotificationsData = () => ({
	type: Notifications.INVALIDATE_NOTIFICATIONS_DATA,
})

const fetchNotificationsData = () => async (dispatch, getState) => {
	dispatch(requestNotificationsData())
	const fetchData = async () => {
		const { notifications: notificationsData } = getState()
		const currentSizeNotification = !notificationsData.init
			? undefined
			: notificationsData.data.length || 0
		const currentSizeIsNotificationSeen = !notificationsData.init
			? undefined
			: notificationsData.data.reduce((object, key) => {
					object[key.is_seen] = object[key.is_seen]
						? object[key.is_seen] + 1
						: 1
					return object
			  }, {}).false || 0
		const params = {
			currentSizeNotification,
			currentSizeIsNotificationSeen,
		}
		const res = await api.get('/customers/all-notifications', params)
		if (res.data) {
			const { data } = res
			dispatch(receiverNotificationsData(data))
			dispatch(initializedNotification(true))
		} else {
			const { status, error } = res
			switch (status) {
				case 401:
					loginTimeout(error)(dispatch)
					break
				default:
					if (status !== 204) {
						dispatch(failedRequestNotificationsData())
						showError(error)
					}
					break
			}
		}
		let timeout
		if (isAuthenticated() !== null) {
			timeout = setTimeout(await fetchData(), 15000)
		} else {
			clearTimeout(timeout)
		}
	}
	isAuthenticated() && (await fetchData())
}

const shouldFetchNotificationsData = (state) => {
	const { data, init, didInvalidate } = state
	if (!init && !data.length) return true
	if (didInvalidate) return true
	return false
}

export const fecthNotificationsDataIfNeeded = () => (dispatch, getState) => {
	if (shouldFetchNotificationsData(getState().notifications)) {
		return dispatch(fetchNotificationsData())
	}
	return Promise.resolve()
}
