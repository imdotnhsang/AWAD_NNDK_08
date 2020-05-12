const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
    account_id: {
        type: String,
        required: true,
        unique:true
    },
    account_type: {
        type: String, // PAYMENT, SAVING
        required: true
    },
    balance: {
        type: String,
        required: true
    }
})

module.exports = Account = mongoose.model('account', AccountSchema)