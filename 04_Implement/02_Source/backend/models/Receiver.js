/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const ReceiverSchema = new mongoose.Schema({
	bank_id: {
		type: String,
		required: true
	},
	account_id: {
		type: String,
		required: true,
		unique: true
	},
	nickname: {
		type: String,
		require: true
	}
})

module.exports = Receiver = mongoose.model('receiver', ReceiverSchema)
