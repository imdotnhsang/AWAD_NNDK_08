/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const PartnerBankSchema =new mongoose.Schema({
    bank_id: {
		type: String,
		required: true,
		unique: true,
	},
	bank_name: {
		type: String,
		required: true,
	},
	our_public_key: {
		type: String,
		required: true,
	},
	partner_public_key: {
		type: String,
		required: true,
    },
    secret_key: {
		type: String,
		required: true,
	},
	our_private_key: {
		type: String,
		required: true,
	},
	hash_algorithm: {
		type: String,
		required: true,
	},
	passphrase: {
		type: String,
	},
	encrypt_type: {
		type: String,
		required:true
	}
})

module.exports = PartnerBank =  mongoose.model('partner_bank', PartnerBankSchema)