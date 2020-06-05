/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
	full_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	phone_number: {
		type: String,
		require: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	default_account_id: {
		type: String,
		unique: true,
	},
	saving_accounts_id: {
		type: Array,
	},
	list_receiver_id: {
		type: Array,
	},
	is_active: {
		type: Boolean,
		require: true,
	},
	created_at: {
		type: Number,
		require: true,
	},
	OTP: {
		code: {
			type: String,
			// required: true
		},
		expired_at: {
			type: Number,
			// required: true
		},
		is_confirmed: {
			type: Boolean,
			// required: true
		},
		is_used: {
			type: Boolean,
			// required: true
		},
	},
})

module.exports = Customer = mongoose.model('customer', CustomerSchema)
