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
    banlance_before_transfer: {
        type: String,
        required: true
    },
    banlance_after_transfer: {
        type: String,
        required: true
    },
    targer_bank: {
        type: String,
        required: true
    }
})

module.exports = Transaction = mongoose.model('transaction', UserSchema)