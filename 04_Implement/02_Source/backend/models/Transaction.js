/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
	entry_time: {
		type: Number,
		required: true
	},
	from_account_id: {
		type: String,
		required: true
	},
	from_account_fullname: {
		type: String,
		required: true
	},
	to_account_id: {
		type: String,
		require: true
	},
	to_account_fullname: {
		type: String,
		require: true
	},
	from_bank_id: {
		type: String,
		require: true
	},
	to_bank_id: {
		type: String,
		required: true
	},
	transaction_type: {
		type: String, // TRANSFER, RECEIVE, REPAYMENT
		required: true
	},
	transaction_amount: {
		type: Number,
		required: true
	},
	transaction_balance_before: {
		type: Number,
		required: true
	},
	transaction_balance_after: {
		type: Number,
		required: true
	}
})

module.exports = Transaction = mongoose.model('transaction', TransactionSchema)
