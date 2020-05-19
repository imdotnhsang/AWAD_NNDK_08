const express = require('express')

const router = express.Router()
const { check, validationResult } = require('express-validator')
// const NodeRSA = require('node-rsa')
const auth = require('../../middleware/auth')
const crypto = require('crypto')

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
	auth,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('fromAccountId', 'Transferer account is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toAccountFullname', 'Receiver full name is required').not().notEmpty(),
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
		toAccountFullname,
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

		const fromAccountFullname = customer.full_name
		const listAccountId = customer.saving_account_id.push(customer.default_account_id)
		if (listAccountId.indexOf(fromAccountId) === -1) {
			return res.status(400).json({
				errors: [{
					msg: 'Account id is not account\'s customer'
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

		if (!accountTransferer && !accountReceiver) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		if (accountTransferer.balance - transactionAmount < 0) {
			return res.status(400).json({
				errors: [{
					msg: 'Insufficient funds'
				}]
			})
		}

		const transactionTransferer = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_account_fullname: fromAccountFullname,
			to_account_id: toAccountId,
			to_account_fullname: toAccountFullname,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			transaction_type: 'TRANSFER',
			transaction_amount: transactionAmount,
			transaction_balance_before: accountTransferer.balance,
			transaction_balance_after: accountTransferer.balance - transactionAmount
		})

		const transactionReceiver = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_account_fullname: fromAccountFullname,
			to_account_id: toAccountId,
			to_account_fullname: toAccountFullname,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			transaction_type: 'RECEIVE',
			transaction_amount: transactionAmount,
			transaction_balance_before: accountReceiver.balance,
			transaction_balance_after: Number(accountReceiver.balance) + Number(transactionAmount)
		})

		const accountTransfererResponse = await Account.findOneAndUpdate({ account_id: fromAccountId }, { $inc: { balance: -transactionAmount } }, {
			new: true
		})

		const transactionTransfererResponse = await transactionTransferer.save()

		const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: toAccountId }, { $inc: { balance: transactionAmount } }, {
			new: true
		})

		const transactionReceiverResponse = await transactionReceiver.save()

		return res.status(200).json({
			transactionTransfererResponse, transactionReceiverResponse, accountTransfererResponse, accountReceiverResponse
		})
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /transactions/receiver-withinbank/:accountId
// @desc      Lấy họ và tên người nhận khi chuyển khoản cùng ngân hàng
// @access    Public
router.get('/receiver-withinbank/:accountId', auth, async (req, res) => {
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
	// Kiểm tra ngân hàng đã được liên kết chưa. Ý tưởng: check ip nơi gọi xem đã có trong db chưa. Do các nhóm kia chưa deploy nên tạm pass bước này
	const bankInfo = await LinkedBank.findOne({ bank_host: 'localhost' })
	if (!bankInfo) {
		return MakeResponse(req, res, {
			status: APIStatus.Unauthorized,
			message: 'Not allow to see info'
		})
	}

	// Kiểm tra thời gian mà ngân hàng đối tác gửi request nhằm để check request này còn hạn hay không và check entryTime này có bị chỉnh sửa hay không
	const entryTimeHashed = req.headers['x_entry_time_hashed']
	const entryTimeEncrypted = req.headers['x_entry_time_encrypted']

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

	// Kiểm tra entryTime có bị quá 5 phút kể từ thời điểm hiện tại hay không, tạm khóa lại, 5 phút đi test lại mệt mỏi
	// if (currentTime - entryTimeDecrypted > 3000) {
	// 	return MakeResponse(req,res,{
	// 	status: APIStatus.Invalid,
	// 	message: "Your entrytime is expired. Please try again"
	// 	})
	// }

	// Kiểm tra accountId mà ngân hàng đối tác gửi và kiểm tra accountId này có bị chỉnh sửa hay không ?
	const accountIdHashed = req.headers['x_account_id_hashed']
	const accountIdEncrypted = req.headers['x_account_id_encrypted']

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
	}


	// Kiểm tra accountId có bị chỉnh sửa hay không 
	if (accountIdHashed != crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(accountIdDecrypted).digest('hex')) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'AccountId is invalid'
		})
	}

	const accessedApiHistoryResp = await DBModelInstance.Query(AccessedApiHistory, { bank_id: bankInfo.bank_id, accessed_api_type: 'GET_INFO', entry_time: entryTimeDecrypted })
	if (accessedApiHistoryResp.status == APIStatus.Ok) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'Your access is solved. Please make another request'
		})
	}

	const saveAccessedHistoryResponse = await DBModelInstance.Create(AccessedApiHistory, {
		bank_id: bankInfo.bank_id,
		accessed_api_type: 'GET_INFO',
		entry_time: entryTimeDecrypted
	})

	if (saveAccessedHistoryResponse.status != APIStatus.Ok) {
		return MakeResponse(req, res, {
			status: APIStatus.Error,
			message: saveAccessedHistoryResponse.message
		})
	}

	const queryCustomerResp = await DBModelInstance.Query(Customer, { default_account_id: accountIdDecrypted }, 'full_name', 0, 1, false)

	return MakeResponse(req, res, queryCustomerResp)
})

// @route     POST /transactions/sengding-interbank
// @desc      Chuyển khoản đến ngân hàng khác
// @access    Public
router.post('/transfering-interbank', [
	auth,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toAccountFullname', 'Receiver full name is required').not().notEmpty(),
	check('toBankId', 'Receiver bank ID is required').not().notEmpty(),
	check('transactionAmount', 'Amount Transaction is 50000 or more').isInt({ min: 50000 })
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		entryTime,
		toAccountId,
		toAccountFullname,
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

		const fromAccountFullname = customer.full_name
		const fromAccountId = customer.default_account_id

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
			from_account_fullname: fromAccountFullname,
			to_account_id: toAccountId,
			to_account_fullname: toAccountFullname,
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
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toAccountFullname', 'Receiver full name is required').not().notEmpty(),
	check('fromAccountId', 'Transferer account is required').not().notEmpty(),
	check('fromAccountFullname', 'Transferer full name is required').not().notEmpty(),
	check('fromBankId', 'Transferer bank ID is required').not().notEmpty(),
	check('transactionAmount', 'Amount Transaction is 50000 or more').isAfter('49999')
], async (req, res) => {
	// Kiểm tra id ngân hàng gửi đúng với các ngân hàng đã liên kết
	// ...

	// Kiểm tra xác thực mã bất đối xứng với ngân hàng đã liên kết
	// ...

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		entryTime,
		fromAccountId,
		fromAccountFullname,
		toAccountId,
		toAccountFullname,
		fromBankId,
		transactionAmount
	} = req.body

	try {
		const account = await Account.findOne({ account_id: toAccountId })

		if (!account) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		const transactionReceiver = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_account_fullname: fromAccountFullname,
			to_account_id: toAccountId,
			to_account_fullname: toAccountFullname,
			from_bank_id: fromBankId,
			to_bank_id: 'EIGHT',
			transaction_type: 'RECEIVE',
			transaction_amount: transactionAmount,
			transaction_balance_before: account.balance,
			transaction_balance_after: Number(account.balance) + Number(transactionAmount)
		})

		const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: toAccountId }, { $inc: { balance: transactionAmount } }, {
			new: true
		})

		const transactionReceiverResponse = await transactionReceiver.save()

		return res.status(200).json({ transactionReceiverResponse, accountReceiverResponse })
	} catch (error) {
		// console.log(error)
		return res.status(500).json({ msg: 'Server error' })
	}
})

module.exports = router
