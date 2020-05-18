// /* eslint-disable no-multi-assign */
// /* eslint-disable no-undef */
// const mongoose = require('mongoose')

// const BankSchema = new mongoose.Schema({
//   bank_id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   bank_name: {
//     type: String,
//     required: true
//   },
//   bank_public_key: {
//     type: String,
//     required: true
//   },
//   encrypt_type: {
//     type: String,
//     required: true
//   },
//   bank_host: {
//     type: String,
//     required: true
//   },
//   secret_key: {
//     type: String,
//     required: true
//   },
//   hash_algorithm: {
//     type: String,
//     required: true
//   },
//   our_private_key: {
//     type: String,
//     required: true
//   }
// })

// module.exports = Bank = mongoose.model('bank', BankSchema)