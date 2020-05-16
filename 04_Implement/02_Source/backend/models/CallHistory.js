const mongoose = require('mongoose')

const CallHistorySchema = new mongoose.Schema({
    bank_id: {
        type: String,
        required: true
    },
    call_time: {
        type: Number,
        required: true
    },
    call_type: {
        type: String, // GET_INFO, INCREASE_MONEY, DECREASE_MONEY
        required: true
    }
})

CallHistorySchema.index({bank_id:1,call_time:1,call_type:1},{unique:true})

module.exports = CallHistory = mongoose.model('call_history', CallHistorySchema)