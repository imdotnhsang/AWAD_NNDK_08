/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const RefreshTokenSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
		unique: true
	},
	entry_time: {
		type: Number,
		required: true
	},
	refresh_token: {
		type: String,
		required: true
	}
})

module.exports = RefreshToken = mongoose.model('refresh_token', RefreshTokenSchema)
