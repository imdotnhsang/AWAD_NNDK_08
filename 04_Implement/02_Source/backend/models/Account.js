/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
  account_id: {
    type: String,
    required: true,
    unique: true
  },
  account_type: {
    type: String, // DEFAULT, SAVING
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
})

module.exports = Account = mongoose.model('account', AccountSchema)
