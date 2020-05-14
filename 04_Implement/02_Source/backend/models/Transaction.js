const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    entry_time: {
        type: String,
        required: true
    },
    from_account_id: {
        type: String,
        required: true
    },
    to_account_id: {
        type: String,
        require: true
    },
    from_bank: {
        type: String,
        require: true
    },
    to_bank: {
        type: String,
        required: true
    },
    type_transfer: {
        type: String, //SEND, RECEIVE
        required: true
    },
    amount_transfer: {
        type: Number,
        required: true
    }
})

module.exports = Transaction = mongoose.model('transaction', UserSchema)