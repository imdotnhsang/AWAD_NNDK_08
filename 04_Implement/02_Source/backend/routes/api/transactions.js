const express = require('express')

const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const crypto = require('crypto')

const { MakeResponse, APIStatus } = require('../../utils/APIStatus.js')

const Account = require('../../models/Account')
const User = require('../../models/User')
const Transaction = require('../../models/Transaction')
const Bank = require('../../models/Bank')
const CallHistory = require('../../models/CallHistory')
const DBModel = require('../../utils/DBModel')


const DBModelInstance = new DBModel()

// @route     POST /transactions/transfering-within-bank
// @desc      Chuyển khoản trong ngân hàng
// @access    Public
router.post('/transfering-within-bank', [
	auth,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toAccountFullname', 'Receiver full name is required').not().notEmpty(),
	check('amountTransaction', 'Amount Transaction is 50000 or more').isAfter('49999')
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		entryTime,
		toAccountId,
		toAccountFullname,
		amountTransaction
	} = req.body

	try {
		const user = await User.findById(req.user.id)

		if (!user) {
			return res.status(400).json({
				errors: [{
					msg: 'User not exists'
				}]
			})
		}

		const fromAccountFullname = user.full_name
		const fromAccountId = user.default_account_id

		if (fromAccountId === toAccountId) {
			return res.status(400).json({
				errors: [{
					msg: 'Beneficiary account cannot coincide with debit account'
				}]
			})
		}

		const accountSender = await Account.findOne({ account_id: fromAccountId })

		const accountReceiver = await Account.findOne({ account_id: toAccountId })

		if (!accountSender || !accountReceiver) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		if (accountSender.balance - amountTransaction < 0) {
			return res.status(400).json({
				errors: [{
					msg: 'Insufficient funds'
				}]
			})
		}

		const transactionSender = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_account_fullname: fromAccountFullname,
			to_account_id: toAccountId,
			to_account_fullname: toAccountFullname,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			type_transaction: 'SEND',
			amount_transaction: amountTransaction,
			balance_before_transaction: accountSender.balance,
			balance_after_transaction: accountSender.balance - amountTransaction
		})

		const transactionReceiver = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_account_fullname: fromAccountFullname,
			to_account_id: toAccountId,
			to_account_fullname: toAccountFullname,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			type_transaction: 'RECEIVE',
			amount_transaction: amountTransaction,
			balance_before_transaction: accountReceiver.balance,
			balance_after_transaction: Number(accountReceiver.balance) + Number(amountTransaction)
		})

		const accountSenderResponse = await Account.findOneAndUpdate({ account_id: fromAccountId }, { $inc: { balance: -amountTransaction } }, {
			new: true
		})

		const transactionSenderResponse = await transactionSender.save()

		const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: toAccountId }, { $inc: { balance: amountTransaction } }, {
			new: true
		})

		const transactionReceiverResponse = await transactionReceiver.save()

		return res.status(200).json({
			transactionSenderResponse, transactionReceiverResponse, accountSenderResponse, accountReceiverResponse
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

		const user = await User.findOne({ default_account_id: accountId })

		if (!user) {
			return res.status(400).json({
				errors: [{
					msg: 'User not exists'
				}]
			})
		}

		const fullName = user.full_name

		return res.status(200).json({ full_name: fullName })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /transactions/receiver-interbank/:accountId
// @desc      Lấy họ và tên người nhận khi ngân hàng khác muốn chuyển khoản
// @access    Public
router.get('/receiver-interbank/:accountId', async (req, res) => {
	// Kiểm tra ngân hàng đã được liên kết chưa. Ý tưởng: check ip nơi gọi xem đã có trong db chưa. Do các nhóm kia chưa deploy nên tạm pass bước này
	const bankInfo = await Bank.findOne({bank_host:'localhost'})
	if (!bankInfo) {
		return MakeResponse(req,res,{
			status: APIStatus.Unauthorized,
			message: 'Not allow to see info'
		})
	}

	// Kiểm tra thời gian mà ngân hàng đối tác gửi request nhằm để check request này còn hạn hay không và check request này có bị chỉnh sửa hay không
	const callTimeEncrypted = req.headers['x_call_time_encrypted']
	const callTimeDecrypted = req.headers['x_call_time_decrypted']
	if (!callTimeEncrypted || !callTimeDecrypted) {
		return MakeResponse(req,res,{
			status: APIStatus.Invalid,
			message: 'Require calltime'
		})
	}

	if (isNaN(callTimeDecrypted)) {
		return MakeResponse(req,res,{
			status: APIStatus.Invalid,
			message: 'Calltime must be an unix number'
		})
	}

	if (callTimeEncrypted != crypto.createHmac(bankInfo.hash_algorithm,bankInfo.secret_key).update(callTimeDecrypted).digest('hex')) {
		return MakeResponse(req,res,{
			status: APIStatus.Invalid,
			message: 'Calltime is invalid'
		})
	}

	let currentTime = Math.round((new Date()).getTime() / 1000)
	if (callTimeDecrypted > currentTime) {
		return MakeResponse(req,res,{
			status: APIStatus.Invalid,
			message: 'Calltime is invalid (calltime is greater than now)'
		})
	}

	if (currentTime - callTimeDecrypted > 300) {
		return MakeResponse(req,res,{
			status: APIStatus.Invalid,
			message: 'Your calltime is expired. Please try again'
		})
	}

	const logInfo = await CallHistory.findOne({bank_id:bankInfo.bank_id, call_type: 'GET_INFO', call_time: callTimeDecrypted})
	if (logInfo) {
		return MakeResponse(req,res,{
			status: APIStatus.Invalid,
			message: 'Your call is calculated'
		})
	}

	const saveCallHistoryResponse = await DBModelInstance.Create(CallHistory,{
		bank_id:bankInfo.bank_id, 
		call_type: 'GET_INFO', 
		call_time: callTimeDecrypted
	})

	if (saveCallHistoryResponse.status != APIStatus.Ok) {
		return MakeResponse(req,res,{
			status: APIStatus.Error,
			message: 'Insert call history fail'
		})
	}

	try {
		const { accountId } = req.params

		const user = await User.findOne({ default_account_id: accountId })

		if (!user) {
			return res.status(400).json({
				errors: [{
					msg: 'User not exists'
				}]
			})
		}

		const fullName = user.full_name

		return res.status(200).json({ full_name: fullName })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     POST /transactions/sengding-interbank
// @desc      Chuyển khoản đến ngân hàng khác
// @access    Public
router.post('/sending-interbank', [
	auth,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toAccountFullname', 'Receiver full name is required').not().notEmpty(),
	check('toBankId', 'Receiver bank ID is required').not().notEmpty(),
	check('amountTransaction', 'Amount Transaction is 50000 or more').isAfter('49999')
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
		amountTransaction
	} = req.body

	try {
		const user = await User.findById(req.user.id)

		if (!user) {
			return res.status(400).json({
				errors: [{
					msg: 'User not exists'
				}]
			})
		}

		const fromAccountFullname = user.full_name
		const fromAccountId = user.default_account_id

		const account = await Account.findOne({ account_id: fromAccountId })

		if (!account) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		if (account.balance - amountTransaction < 0) {
			return res.status(400).json({
				errors: [{
					msg: 'Insufficient funds'
				}]
			})
		}

		const transactionSender = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_account_fullname: fromAccountFullname,
			to_account_id: toAccountId,
			to_account_fullname: toAccountFullname,
			from_bank_id: 'EIGHT',
			to_bank_id: toBankId,
			type_transaction: 'SEND',
			amount_transaction: amountTransaction,
			balance_before_transaction: account.balance,
			balance_after_transaction: account.balance - amountTransaction
		})

		// Kiểm tra ngân hàng người nhận có đúng mã id
		// ...

		// Gọi api chuyển  khoản vào ngân hàng khác
		// ...

		const accountSenderResponse = await Account.findOneAndUpdate({ account_id: fromAccountId }, { $inc: { balance: -amountTransaction } }, {
			new: true
		})

		const transactionSenderResponse = await transactionSender.save()

		return res.status(200).json({ transactionSenderResponse, accountSenderResponse })
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
	check('fromAccountId', 'Sender account is required').not().notEmpty(),
	check('fromAccountFullname', 'Sender full name is required').not().notEmpty(),
	check('fromBankId', 'Sender bank ID is required').not().notEmpty(),
	check('amountTransaction', 'Amount Transaction is 50000 or more').isAfter('49999')
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
		amountTransaction
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
			type_transaction: 'RECEIVE',
			amount_transaction: amountTransaction,
			balance_before_transaction: account.balance,
			balance_after_transaction: Number(account.balance) + Number(amountTransaction)
		})

		const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: toAccountId }, { $inc: { balance: amountTransaction } }, {
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
