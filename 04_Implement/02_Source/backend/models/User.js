const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
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
    role: {
        type: String, // CUSTOMER, EMPLOYEE, ADMIN
        required: true
    },
    default_account_id: {
        type: Number,
        unique: true
    },
    saving_account_id: {
        type: Array
    }
})

module.exports = User = mongoose.model('user', UserSchema)

