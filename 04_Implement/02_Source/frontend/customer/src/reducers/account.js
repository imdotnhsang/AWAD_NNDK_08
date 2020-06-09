import { Account } from '../constants/actionTypes'

const initialState = {
	account: {
		name: '',
		email: '',
		phone: '',
	},
	loading: false,
	error: '',
}

const account = (state = initialState, action) => {
	switch (action.type) {
		case Account.REQUEST_ACCOUNT_DATA:
			return {
				...state,
				loading: true,
				error: '',
			}
		case Account.RECEIVE_ACCOUNT_DATA:
			return {
				...state,
				account: {
					name: action.data.full_name,
					email: action.data.email,
					phone: action.data.phone_number,
				},
				loading: false,
				error: '',
			}
		case Account.FAILED_REQUEST_ACCOUNT_DATA:
			return {
				...state,
				loading: false,
				error: action.error,
			}
		default:
			return state
	}
}
export default account
