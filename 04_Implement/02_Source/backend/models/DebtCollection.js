/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const DebtCollectionSchema = new mongoose.Schema({
	debtor_fullname: {
		type: String,
		required: true
	},
	debtor_default_account: {
		type: String,
		required: true
	},
	lender_fullname: {
		type: String,
		require: true
	},
	lender_default_account: {
		type: String,
		required: true
	},
	debt_status: {
		type: String, // COLLECTING, PAID, CANCELLED
		require: true
	},
	debt_amount: {
		type: Number,
		require: true
	},
	debt_message: {
		type: String,
		require: true
	},
	debt_reason_cancel: {
		type: String
	}
})

module.exports = DebtCollection = mongoose.model('debt_collection', DebtCollectionSchema)
