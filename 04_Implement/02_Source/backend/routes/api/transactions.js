const express = require('express')

const router = express.Router()
const { check, validationResult } = require('express-validator')
// const NodeRSA = require('node-rsa')
const authCustomer = require('../../middlewares/authCustomer')
const crypto = require('crypto')
const openpgp = require('openpgp')

const { MakeResponse, APIStatus } = require('../../utils/APIStatus.js')

const Account = require('../../models/Account')
const Customer = require('../../models/Customer')
const Transaction = require('../../models/Transaction')
const LinkedBank = require('../../models/LinkedBank')
const AccessedApiHistory = require('../../models/AccessedApiHistory')
const DBModel = require('../../utils/DBModel')


const DBModelInstance = new DBModel()

// @route     POST /transactions/transfering-within-bank
// @desc      Chuyển khoản trong ngân hàng
// @access    Public
router.post('/transfering-within-bank', [
	authCustomer,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('fromAccountId', 'Transferer account is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toFullName', 'Receiver full name is required').not().notEmpty(),
	check('transactionAmount', 'Amount Transaction is 50000 or more').isInt({ min: 50000 })
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		entryTime,
		fromAccountId,
		toAccountId,
		toFullName,
		transactionAmount
	} = req.body

	const checkErrorsMongoose = {
		updateTransfererAccount: false,
		createTransfererTransaction: false,
		updateReceiverAccount: false
	}

	try {
		const customer = await Customer.findById(req.user.id)

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const fromFullName = customer.full_name
		const listAccountId = [...customer.saving_account_id, customer.default_account_id]

		if (listAccountId.indexOf(fromAccountId) === -1) {
			return res.status(400).json({
				errors: [{
					msg: 'Transfering account id is not account\'s customer'
				}]
			})
		}

		if (fromAccountId === toAccountId) {
			return res.status(400).json({
				errors: [{
					msg: 'Beneficiary account cannot coincide with debit account'
				}]
			})
		}

		const accountTransferer = await Account.findOne({ account_id: fromAccountId })

		const accountReceiver = await Account.findOne({ account_id: toAccountId })

		if (!accountTransferer || !accountReceiver) {
			return res.status(400).json({
				errors: [{
					msg: 'Account transferer or account receiver not exists'
				}]
			})
		}

		if (accountTransferer.balance - transactionAmount < 50000) {
			return res.status(400).json({
				errors: [{
					msg: 'Insufficient funds'
				}]
			})
		}

		const transactionTransferer = {
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_fullname: fromFullName,
			to_account_id: toAccountId,
			to_fullname: toFullName,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			transaction_type: 'TRANSFER',
			transaction_amount: transactionAmount,
			transaction_balance_before: accountTransferer.balance
		}

		const transactionReceiver = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_fullname: fromFullName,
			to_account_id: toAccountId,
			to_fullname: toFullName,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			transaction_type: 'RECEIVE',
			transaction_amount: transactionAmount,
			transaction_balance_before: accountReceiver.balance,
		})

		const accountTransfererResponse = await Account.findOneAndUpdate(
			{ account_id: fromAccountId },
			{ $inc: { balance: -transactionAmount } },
			{ new: true }
		)

		checkErrorsMongoose.updateTransfererAccount = { account_id: accountTransfererResponse.account_id, transaction_amount: transactionAmount }

		const transactionTransfererResponse = await new Transaction({
			...transactionTransferer,
			transaction_balance_after: accountTransfererResponse.balance,
			transaction_status: 'FAILED'
		}).save()

		checkErrorsMongoose.createTransfererTransaction = {
			...transactionTransferer,
			transaction_balance_before: accountTransfererResponse.balance,
			transaction_balance_after: accountTransferer.balance,
			transaction_status: 'REFUND'
		}

		const accountReceiverResponse = await Account.findOneAndUpdate(
			{ account_id: toAccountId },
			{ $inc: { balance: transactionAmount } },
			{ new: true }
		)

		checkErrorsMongoose.updateReceiverAccount = { account_id: accountReceiverResponse.account_id, transaction_amount: transactionAmount }

		const transactionReceiverResponse = await Transaction({
			...transactionReceiver._doc,
			transaction_balance_after: accountReceiverResponse.balance,
			transaction_status: 'FAILED'
		}).save()

		transactionTransfererResponse.transaction_status = 'SUCCESS'
		transactionTransfererResponse.save()

		transactionReceiverResponse.transaction_status = 'SUCCESS'
		transactionReceiverResponse.save()

		return res.status(200).json({
			transactionTransfererResponse, transactionReceiverResponse, accountTransfererResponse, accountReceiverResponse
		})
	} catch (error) {
		if (checkErrorsMongoose.updateReceiverAccount !== false) {
			await Account.findOneAndUpdate(
				{ account_id: checkErrorsMongoose.updateReceiverAccount.account_id },
				{ $inc: { balance: -checkErrorsMongoose.updateReceiverAccount.transaction_amount } },
				{ new: true }
			)
		}

		if (checkErrorsMongoose.updateTransfererAccount !== false) {
			await Account.findOneAndUpdate(
				{ account_id: checkErrorsMongoose.updateTransfererAccount.account_id },
				{ $inc: { balance: checkErrorsMongoose.updateTransfererAccount.transaction_amount } },
				{ new: true }
			)
		}

		if (checkErrorsMongoose.createTransfererTransaction !== false) {
			await new Transaction(checkErrorsMongoose.createTransfererTransaction).save()
		}

		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /transactions/receiver-withinbank/:accountId
// @desc      Lấy họ và tên người nhận khi chuyển khoản cùng ngân hàng
// @access    Public
router.get('/receiver-withinbank/:accountId', authCustomer, async (req, res) => {
	try {
		const { accountId } = req.params

		const customer = await Customer.findOne({ default_account_id: accountId })

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const fullName = customer.full_name

		return res.status(200).json({ full_name: fullName })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /transactions/receiver-interbank/
// @desc      Lấy họ và tên người nhận khi ngân hàng khác muốn chuyển khoản
// @access    Public
router.get('/receiver-interbank', async (req, res) => {
	
	try {
		const partnerCode = req.headers['x_partner_code']
		if (!partnerCode) {
			return MakeResponse(req,res,{
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api'
			})
		}

		const bankInfo = await LinkedBank.findOne({partner_code: partnerCode})
		if (!bankInfo) {
			return MakeResponse(req,res,{
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api'
			})
		}

		let digitalSignature = req.headers['x_signature']
		if (!digitalSignature) {
			return MakeResponse(req,res,{
				status: APIStatus.Forbidden,
				message: 'Require digital signature'
			})
		}

		// Kiểm tra accountId mà ngân hàng đối tác gửi và kiểm tra accountId này có bị chỉnh sửa hay không ?
		const accountIdHashed = req.headers['x_account_id_hashed']
		let accountIdEncrypted = req.headers['x_account_id_encrypted']

		if (!accountIdHashed || !accountIdEncrypted) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Require account_id'
			})
		}


		let accountIdDecrypted = ''
		if (bankInfo.encrypt_type == 'RSA') {
			// eslint-disable-next-line no-undef
			const buffer = Buffer.from(accountIdEncrypted, 'base64')
			accountIdDecrypted = crypto.privateDecrypt({ key: bankInfo.our_private_key, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf-8')
			console.log('Account ID: ' + accountIdDecrypted)
		} else if (bankInfo.encrypt_type == 'PGP') {
			const { keys: [privateKey] } = await openpgp.key.readArmored(bankInfo.our_private_key)
			await privateKey.decrypt(bankInfo.passphrase)

			accountIdEncrypted = accountIdEncrypted.replace(/\\n/g, '\n')

			const { data: decrypted } = await openpgp.decrypt({
				message: await openpgp.message.readArmored(accountIdEncrypted),             // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key)).keys, // for verification (optional)
				privateKeys: [privateKey]                                           // for decryption
			})

			accountIdDecrypted = decrypted
			console.log('Account id: ' + accountIdDecrypted)
		}


		// Kiểm tra accountId có bị chỉnh sửa hay không 
		if (accountIdHashed != crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(accountIdDecrypted).digest('hex')) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'AccountId is invalid'
			})
		}

		// Kiểm tra chữ ký có hợp lệ hay không
		if (bankInfo.encrypt_type == 'RSA') {

			// eslint-disable-next-line no-undef
			const bufferAccountId = Buffer.from(accountIdDecrypted, 'base64')
			// eslint-disable-next-line no-undef
			const bufferSignature = Buffer.from(digitalSignature,'base64')

			const check = crypto.verify(
				bankInfo.hash_algorithm,
				bufferAccountId,
				{
					key: bankInfo.partner_public_key,
					padding: crypto.constants.RSA_PKCS1_PSS_PADDING
				},
				bufferSignature
			)
			if (!check) {
				return MakeResponse(req,res,{
					status: APIStatus.Invalid,
					message: 'Signature is invalid'
				})
			}
		} else if (bankInfo.encrypt_type == 'PGP') {

			digitalSignature = digitalSignature.replace(/\\n/g, '\n')

			const verified = await openpgp.verify({
				message: await openpgp.cleartext.readArmored(digitalSignature),           // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.partner_public_key)).keys // for verification
			})
			const { valid } = verified.signatures[0]
			if (!valid) {
				return MakeResponse(req,res,{
					stauts: APIStatus.Invalid,
					message: 'Signature is invalid'
				})
			}
		}
		

		// Kiểm tra thời gian mà ngân hàng đối tác gửi request nhằm để check request này còn hạn hay không và check entryTime này có bị chỉnh sửa hay không
		const entryTimeHashed = req.headers['x_entry_time_hashed']
		let entryTimeEncrypted = req.headers['x_entry_time_encrypted']


		if (!entryTimeHashed || !entryTimeEncrypted) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Require entrytime'
			})
		}

		// Decrypt entryTime bằng private key
		let entryTimeDecrypted = ''
		if (bankInfo.encrypt_type == 'RSA') {
			// eslint-disable-next-line no-undef
			const buffer = Buffer.from(entryTimeEncrypted, 'base64')
			entryTimeDecrypted = crypto.privateDecrypt({ key: bankInfo.our_private_key, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf-8')
			console.log('Entry time: ' + entryTimeDecrypted)
		} else if (bankInfo.encrypt_type == 'PGP') {
			const { keys: [privateKey] } = await openpgp.key.readArmored(bankInfo.our_private_key)
			await privateKey.decrypt(bankInfo.passphrase)

			entryTimeEncrypted = entryTimeEncrypted.replace(/\\n/g, '\n')

			const { data: decrypted } = await openpgp.decrypt({
				message: await openpgp.message.readArmored(entryTimeEncrypted),             // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key)).keys, // for verification (optional)
				privateKeys: [privateKey]                                           				// for decryption
			})

			entryTimeDecrypted = decrypted
			console.log('Entry time: ' + entryTimeDecrypted)
		}


		// Kiểm tra xem entryTime có hợp lệ hay không
		if (isNaN(entryTimeDecrypted)) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time must be an unix number'
			})
		}

		// Kiểm tra entryTime có bị chỉnh sửa hay không 
		if (entryTimeHashed != crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(entryTimeDecrypted).digest('hex')) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time is invalid'
			})
		}

		// Kiểm tra entryTime có bị "sớm" hơn thời điểm hiện tại hay không
		let currentTime = Math.round((new Date()).getTime() / 1000)
		if (entryTimeDecrypted > currentTime) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time is invalid (entrytime is greater than now)'
			})
		}

		// Kiểm tra entryTime có bị quá 5 phút kể từ thời điểm hiện tại hay không
		if (currentTime - entryTimeDecrypted > 300) {
			return MakeResponse(req,res,{
				status: APIStatus.Invalid,
				message: 'Your entrytime is expired. Please try again'
			})
		}


		const accessedApiHistoryResp = await DBModelInstance.Query(AccessedApiHistory, { bank_id: bankInfo.bank_id, accessed_api_type: 'GET_INFO', entry_time: entryTimeDecrypted, digital_signature: digitalSignature})
		if (accessedApiHistoryResp.status == APIStatus.Ok) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Your access is solved. Please make another request'
			})
		}

		const saveAccessedHistoryResponse = await DBModelInstance.Create(AccessedApiHistory, {
			bank_id: bankInfo.bank_id,
			accessed_api_type: 'GET_INFO',
			entry_time: entryTimeDecrypted,
			digital_signature : digitalSignature
		})

		if (saveAccessedHistoryResponse.status != APIStatus.Ok) {
			return MakeResponse(req, res, {
				status: APIStatus.Error,
				message: saveAccessedHistoryResponse.message
			})
		}

		const queryCustomerResp = await DBModelInstance.Query(Customer, { default_account_id: accountIdDecrypted }, 'full_name', 0, 1, false)

		return MakeResponse(req, res, queryCustomerResp)

	} catch (err) {
		console.log(err)
		res.status(500).json({
			status: APIStatus.Error,
			message:err
		})
	}
})

// @route     POST /transactions/sengding-interbank
// @desc      Chuyển khoản đến ngân hàng khác
// @access    Public
router.post('/transfering-interbank', [
	authCustomer,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toFullName', 'Receiver full name is required').not().notEmpty(),
	check('toBankId', 'Receiver bank ID is required').not().notEmpty(),
	check('transactionAmount', 'Amount Transaction is 50000 or more').isInt({ min: 50000 })
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		entryTime,
		fromAccountId,
		toAccountId,
		toFullName,
		toBankId,
		transactionAmount
	} = req.body

	try {

		const customer = await Customer.findById(req.user.id)

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const fromFullName = customer.full_name

		const account = await Account.findOne({ account_id: fromAccountId })

		if (!account) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		if (account.balance - transactionAmount < 0) {
			return res.status(400).json({
				errors: [{
					msg: 'Insufficient funds'
				}]
			})
		}

		const transactionTransferer = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_fullname: fromFullName,
			to_account_id: toAccountId,
			to_fullname: toFullName,
			from_bank_id: 'EIGHT',
			to_bank_id: toBankId,
			transaction_type: 'TRANSFER',
			transaction_amount: transactionAmount,
			transaction_balance_before: account.balance,
			transaction_balance_after: account.balance - transactionAmount
		})

		// Kiểm tra ngân hàng người nhận có đúng mã id
		// ...

		// Gọi api chuyển  khoản vào ngân hàng khác
		// ...

		const accountTransfererResponse = await Account.findOneAndUpdate({ account_id: fromAccountId }, { $inc: { balance: -transactionAmount } }, {
			new: true
		})

		const transactionTransfererResponse = await transactionTransferer.save()

		return res.status(200).json({ transactionTransfererResponse, accountTransfererResponse })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     POST /transactions/receiving-interbank
// @desc      Ngân hàng khác chuyển khoản vào
// @access    Public
router.post('/receiving-interbank', [
	// check('entryTime', 'Entry time is required').not().notEmpty(),
	// check('toAccountId', 'Receiver account is required').not().notEmpty(),
	// check('toFullName', 'Receiver full name is required').not().notEmpty(),
	// check('fromAccountId', 'Transferer account is required').not().notEmpty(),
	// check('fromFullName', 'Transferer full name is required').not().notEmpty(),
	// check('fromBankId', 'Transferer bank ID is required').not().notEmpty(),
	// check('transactionAmount', 'Amount Transaction is 50000 or more').isAfter('49999')
], async (req, res) => {
	
	try {

		const partnerCode = req.headers['x_partner_code']
		if (!partnerCode) {
			return MakeResponse(req,res,{
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api'
			})
		}
	
		const bankInfo = await LinkedBank.findOne({partner_code: partnerCode})
		if (!bankInfo) {
			return MakeResponse(req,res,{
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api'
			})
		}
	
		// const {
		// 	data,
		// 	data_hashed,
		// 	digital_sign
		// } = req.body

		// decrypt body data
		let dataDecryptedObject = ''
		if (bankInfo.encrypt_type == 'RSA') {

			// eslint-disable-next-line no-undef
			const buffer = Buffer.from(req.body.data,'base64')
			const dataDecryptedStr = crypto.privateDecrypt({ key: bankInfo.our_private_key, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf-8')
			dataDecryptedObject = JSON.parse(dataDecryptedStr)

		} else if (bankInfo.encrypt_type == 'PGP') {

			const { keys: [privateKey] } = await openpgp.key.readArmored(bankInfo.our_private_key)
			await privateKey.decrypt(bankInfo.passphrase)

			const { data: decrypted } = await openpgp.decrypt({
				message: await openpgp.message.readArmored(req.body.data),             // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key)).keys, // for verification (optional)
				privateKeys: [privateKey]                                           				// for decryption
			})

			dataDecryptedObject = JSON.parse(decrypted)
		}


		// Kiểm tra xem entryTime có hợp lệ hay không
		if (isNaN(dataDecryptedObject.entryTime)) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time must be an unix number'
			})
		}

		// Kiểm tra entryTime có bị "sớm" hơn thời điểm hiện tại hay không
		let currentTime = Math.round((new Date()).getTime() / 1000)
		if (dataDecryptedObject.entryTime > currentTime) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time is invalid (entrytime is greater than now)'
			})
		}

		// Kiểm tra entryTime có bị quá 5 phút kể từ thời điểm hiện tại hay không
		if (currentTime - dataDecryptedObject.entryTime > 300) {
			return MakeResponse(req,res,{
				status: APIStatus.Invalid,
				message: 'Your entrytime is expired. Please try again'
			})
		}

		// Kiểm tra request này có quá hạn hay không
		const accessedApiHistoryResp = await DBModelInstance.Query(AccessedApiHistory, { bank_id: bankInfo.bank_id, accessed_api_type: 'TRANSFER', entry_time: dataDecryptedObject.entryTime, digital_signature: req.body.digital_sign})
		if (accessedApiHistoryResp.status == APIStatus.Ok) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Your access is solved. Please make another request'
			})
		}

		// Kiểm tra gói tin có bị chỉnh sửa hay không
		if (req.body.data_hashed != crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(JSON.stringify(dataDecryptedObject)).digest('hex')) {
			return MakeResponse(req,res,{
				status: APIStatus.Invalid,
				message: 'Your data is invalid'
			})
		}

		// Kiểm tra chữ ký bất đối xứng
		if (bankInfo.encrypt_type == 'RSA') {
			// eslint-disable-next-line no-undef
			const bufferBodyData = Buffer.from(JSON.stringify(dataDecryptedObject), 'base64')
			// eslint-disable-next-line no-undef
			const bufferSignature = Buffer.from(req.body.digital_sign,'base64')
			const check = crypto.verify(
				bankInfo.hash_algorithm,
				bufferBodyData,
				{
					key: bankInfo.partner_public_key,
					padding: crypto.constants.RSA_PKCS1_PSS_PADDING
				},
				bufferSignature
			)
			if (!check) {
				return MakeResponse(req,res,{
					status: APIStatus.Invalid,
					message: 'Signature is invalid'
				})
			}
		} else if (bankInfo.encrypt_type == 'PGP') {
			req.body.digital_sign = '-----BEGIN PGP SIGNED MESSAGE-----\n' + 'Hash: SHA512\n\n' + JSON.stringify(dataDecryptedObject) + '\n' + req.body.digital_sign
			req.body.digital_sign = req.body.digital_sign.replace(/\\n/g, '\n')
			const verified = await openpgp.verify({
				message: await openpgp.cleartext.readArmored(req.body.digital_sign),           // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.partner_public_key)).keys // for verification
			})
			const { valid } = verified.signatures[0]
			if (!valid) {
				return MakeResponse(req,res,{
					stauts: APIStatus.Invalid,
					message: 'Signature is invalid'
				})
			}
		}

		const saveAccessedHistoryResponse = await DBModelInstance.Create(AccessedApiHistory, {
			bank_id: bankInfo.bank_id,
			accessed_api_type: 'TRANSFER',
			entry_time: dataDecryptedObject.entryTime,
			digital_signature: req.body.digital_sign
		})
	
		if (saveAccessedHistoryResponse.status != APIStatus.Ok) {
			return MakeResponse(req, res, {
				status: APIStatus.Error,
				message: saveAccessedHistoryResponse.message
			})
		}


		const account = await Account.findOne({ account_id: dataDecryptedObject.toAccountId })

		if (!account) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		const transactionReceiver = new Transaction({
			entry_time: dataDecryptedObject.entryTime,
			from_account_id: dataDecryptedObject.fromAccountId,
			from_fullname: dataDecryptedObject.fromFullName,
			to_account_id: dataDecryptedObject.toAccountId,
			to_fullname: dataDecryptedObject.toFullName,
			from_bank_id: dataDecryptedObject.fromBankId,
			to_bank_id: 'EIGHT',
			transaction_type: 'RECEIVE',
			transaction_amount: dataDecryptedObject.transactionAmount,
			transaction_balance_before: account.balance,
			transaction_balance_after: Number(account.balance) + Number(dataDecryptedObject.transactionAmount)
		})

		const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: dataDecryptedObject.toAccountId }, { $inc: { balance: dataDecryptedObject.transactionAmount } }, {
			new: true
		})

		const transactionReceiverResponse = await transactionReceiver.save()
		return res.status(200).json({ transactionReceiverResponse, accountReceiverResponse })
	} catch (error) {
		return res.status(500).json({ msg: error.toString() })
	}
})

module.exports = router
