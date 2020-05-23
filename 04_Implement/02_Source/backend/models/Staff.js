/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const StaffSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
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
	position: {
		type: String, // ADMINISTRATOR, EMPLOYEE
		require: true
	},
	created_at: {
		type: Number,
		require: true
	}
})

module.exports = Staff = mongoose.model('staff', StaffSchema)
