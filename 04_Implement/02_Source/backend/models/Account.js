/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
	account_id: {
		type: String,
		required: true,
		unique: true,
	},
	account_type: {
		type: String, // DEFAULT, SAVING
		required: true,
	},
	account_service: {
		type: String, // VISA, MASTERCARD
		required: true,
	},
	balance: {
		type: Number,
		required: true,
	},
	created_at: {
		type: Number,
	},
	term: {
		type: Number,
	},
	end_time: {
		type: Number,
	},
	interest_rate: {
		type: Number,
	},
})

module.exports = Account = mongoose.model('account', AccountSchema)
