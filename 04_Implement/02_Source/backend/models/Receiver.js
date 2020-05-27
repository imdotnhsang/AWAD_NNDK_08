/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const ReceiverSchema = new mongoose.Schema({
	bank_id: {
		type: String,
		required: true,
	},
	bank_name: {
		type: String,
		required: true,
	},
	account_id: {
		type: String,
		required: true,
	},
	nickname: {
		type: String,
		require: true,
	},
})

module.exports = Receiver = mongoose.model('receiver', ReceiverSchema)
