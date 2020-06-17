/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const DebtCollectionSchema = new mongoose.Schema({
	entry_time: {
		type: Number,
		required: true,
	},
	borrower_fullname: {
		type: String,
		required: true,
	},
	borrower_default_account: {
		type: String,
		required: true,
	},
	lender_fullname: {
		type: String,
		require: true,
	},
	lender_default_account: {
		type: String,
		required: true,
	},
	debt_status: {
		type: String, // COLLECTING, PAID, CANCELLED
		require: true,
	},
	debt_amount: {
		type: Number,
		require: true,
	},
	debt_message: {
		type: String,
		require: true,
	},
	cancelled_by_id: {
		type: String,
	},
	cancelled_by_fullname: {
		type: String,
	},
	debt_reason_cancel: {
		type: String,
	},
	notification_time: {
		type: Number,
	},
	is_seen: {
		type: Boolean,
	},
})

module.exports = DebtCollection = mongoose.model(
	'debt_collection',
	DebtCollectionSchema
)
