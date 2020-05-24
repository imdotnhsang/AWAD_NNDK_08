/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const AccessedApiHistorySchema = new mongoose.Schema({
	bank_id: {
		type: String,
		required: true
	},
	entry_time: {
		type: Number,
		required: true
	},
	accessed_api_type: {
		type: String, // GET_INFO, TRANSFER, DEBT_COLLECTION
		required: true
	},
	digital_signature: {
		type: String,
		required: true
	}
})

AccessedApiHistorySchema.index({bank_id:1,entry_time:1,accessed_api_type:1,digital_signature:1},{unique:true})

module.exports = CallHistory = mongoose.model('accessed_api_history', AccessedApiHistorySchema)