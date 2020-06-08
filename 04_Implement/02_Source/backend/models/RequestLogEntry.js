/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const RequestLogEntrySchema = new mongoose.Schema({
    status: {
        type: String,
        required:true
    },
    req_url: {
        type: String,
        required: true
    },
    req_method: {
        type: String,
        required: true
    },
    req_header: {
        type: Object
    },
    req_form_data: {
        type: Object
    },
    req_body: {
        type: Object
    },
    total_time: {
        type: Number
    },
    retry_count: {
        type: Number
    },
    results: {
        type: Array
    },
    err_log: {
        type: String
    },
    keys: {
        type: String
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = RequestLogEntry = mongoose.model(
	'request_log',
	RequestLogEntrySchema
)
