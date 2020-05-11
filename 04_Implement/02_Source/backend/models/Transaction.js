const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    action_account_id: {
        type: String,
        required: true
    },
    target_account_id: {
        type: String,
        require: true
    },
    amount_transfer: {
        type: String,
        required: true
    },
    balance_before_transfer: {
        type: String,
        required: true
    },
    balance_after_transfer: {
        type: String,
        required: true
    },
    target_bank: {
        type: String,
        required: true
    }
})

module.exports = Transaction = mongoose.model('transaction', UserSchema)