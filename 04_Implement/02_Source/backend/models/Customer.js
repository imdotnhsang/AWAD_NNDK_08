/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
	full_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone_number: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	default_account_id: {
		type: String,
		unique: true
	},
	saving_account_id: {
		type: Array
	},
	create_at: {
		type: Number,
		// require: true
	},
	is_active: {
		type: Boolean,
		// require: true
	},
	OTP: {
		code: {
			type: String,
			// required: true
		},
		expiredAt: {
			type: Number,
			// required: true
		}
	}
})

module.exports = Customer = mongoose.model('customer', CustomerSchema)
