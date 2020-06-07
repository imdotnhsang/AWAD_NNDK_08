const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const { customAlphabet } = require('nanoid')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const { sendOTPCode } = require('../../utils/OTP/sendOTP.js')

const Customer = require('../../models/Customer')
const Account = require('../../models/Account')
const Receiver = require('../../models/Receiver')
const LinkedBank = require('../../models/LinkedBank')
const Transaction = require('../../models/Transaction')
const DebtCollection = require('../../models/DebtCollection')

// @route     GET /customers/default-account
// @desc      Get information default account of customer
// @access    Private (customer)
router.get('/default-account', auth, async (req, res) => {
	const customer = await Customer.findById(req.user.id)
	if (!customer) {
		return res.status(400).json({
			errors: [
				{
					msg: 'Customer not exists.',
				},
			],
		})
	}

	const { default_account_id: defaultAccountId } = customer

	try {
		const defaultAccount = await Account.findOne(
			{
				account_id: defaultAccountId,
			},
			{ _id: 0, __v: 0 }
		)

		const response = {
			msg: 'Default card successfully got.',
			data: defaultAccount,
		}
		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error...' })
	}
})

// @route     GET /customers/all-accounts
// @desc      Get all accounts of customer
// @access    Private (customer)
router.get('/all-accounts', auth, async (req, res) => {
	const customer = await Customer.findById(req.user.id)
	if (!customer) {
		return res.status(400).json({
			errors: [
				{
					msg: 'Customer not exists.',
				},
			],
		})
	}

	const {
		default_account_id: defaultAccountId,
		saving_accounts_id: savingAccountsId,
	} = customer

	Promise.all([
		Account.find(
			{
				account_id: {
					$in: savingAccountsId.map((e) => e),
				},
			},
			{ _id: 0, __v: 0 }
		),
		Account.findOne(
			{
				account_id: defaultAccountId,
			},
			{ _id: 0, __v: 0 }
		),
	])
		.then(([savingAccounts, defaultAccount]) => {
			const response = {
				msg: 'All cards successfully got.',
				data: {
					default_account: defaultAccount,
					saving_accounts: savingAccounts,
				},
			}
			return res.status(200).json(response)
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		})
})

// @route     POST /customers/add-receiver
// @desc      Add receiver to list receiver which is received payment
// @access    Private (customer)
router.post(
	'/add-receiver',
	[
		auth,
		check('bankName', 'Bank name is required').not().notEmpty(),
		check('bankId', 'Bank id is required').not().notEmpty(),
		check('accountId', 'Account id is required').not().notEmpty(),
		check('fullName', 'Full name is required').not().notEmpty(),
		check('nickname', 'Nickname is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (errors) {
			if (!errors.isEmpty()) {
				return res.status(400).send(errors)
			}
		}

		const { bankName, bankId, accountId, nickname, fullName } = req.body

		const userId = req.user.id

		const checkErrorsMongoose = {
			createReceiver: false,
		}

		try {
			const customer = await Customer.findById(userId)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			const linkedBank = await LinkedBank.findOne({ bank_id: bankId })

			if (bankId !== 'EIGHT' && !linkedBank) {
				return res.status(400).json({
					errors: [{ msg: 'Bank is not connected.' }],
				})
			}

			if (accountId === customer.default_account_id) {
				return res.status(400).json({
					errors: [
						{ msg: 'Beneficiary account cannot coincide with debit account.' },
					],
				})
			}

			const list_accountReceivers_id = (
				await Receiver.find({
					_id: {
						$in: customer.list_receiver_id.map((e) =>
							mongoose.Types.ObjectId(e)
						),
					},
				})
			).map((e) => e.account_id)

			if (list_accountReceivers_id.indexOf(accountId) !== -1) {
				return res.status(400).json({
					errors: [{ msg: 'Account exists.' }],
				})
			}

			const receiver = new Receiver({
				bank_id: bankId,
				bank_name: bankName,
				account_id: accountId,
				full_name: fullName,
				nickname,
			})

			const responseReceiver = await receiver.save()

			checkErrorsMongoose.createReceiver = {
				id: responseReceiver._id,
			}

			customer.list_receiver_id.push(responseReceiver._id)
			await customer.save()

			const response = {
				msg: 'Receiver successfully added.',
				data: {
					receiver_id: responseReceiver._id,
					nickname: responseReceiver.nickname,
					full_name: responseReceiver.full_name,
					account_id: responseReceiver.account_id,
					bank_name: responseReceiver.bank_name,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.createAccountDefault !== false) {
				await Receiver.findByIdAndRemove(checkErrorsMongoose.createReceiver.id)
			}

			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /customers/update-receiver
// @desc      Update information receiver
// @access    Private (customer)
router.put(
	'/update-receiver',
	[
		auth,
		check('receiverId', 'Receiver id is required').not().notEmpty(),
		check('nickname', 'Nickname is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (errors) {
			if (!errors.isEmpty()) {
				return res.status(400).send(errors)
			}
		}

		const { receiverId, nickname } = req.body

		try {
			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			if (customer.list_receiver_id.indexOf(receiverId) === -1) {
				return res.status(400).json({
					errors: [{ msg: 'Receiver not exists.' }],
				})
			}

			const receiver = await Receiver.findById(receiverId)
			if (nickname === receiver.nickname) {
				return res.status(400).json({
					errors: [{ msg: 'New nickname cannot coincide with old nickname.' }],
				})
			}

			receiver.nickname = nickname
			const responseReceiver = await receiver.save()

			const response = {
				msg: 'Receiver successfully updated.',
				data: {
					receiver_id: responseReceiver._id,
					nickname: responseReceiver.nickname,
					full_name: responseReceiver.full_name,
					account_id: responseReceiver.account_id,
					bank_name: responseReceiver.bank_name,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     DELETE /customers/delete-receiver
// @desc      Delete receiver from list receiver
// @access    Private (customer)
router.delete(
	'/delete-receiver',
	[auth, check('receiverId', 'Receiver id is required').not().notEmpty()],
	async (req, res) => {
		const errors = validationResult(req)
		if (errors) {
			if (!errors.isEmpty()) {
				return res.status(400).send(errors)
			}
		}

		const { receiverId } = req.body

		try {
			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			const inxItem = customer.list_receiver_id.indexOf(receiverId)

			if (inxItem === -1) {
				return res.status(400).json({
					errors: [{ msg: 'Receiver not exists.' }],
				})
			}

			await Receiver.findByIdAndDelete(receiverId)

			customer.list_receiver_id.splice(inxItem, 1)
			await customer.save()

			const response = { msg: 'Receiver successfully deleted.' }
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

router.get('/all-debt-collections', auth, async (req, res) => {
	const customer = await Customer.findById(req.user.id)
	if (!customer) {
		return res.status(400).json({
			errors: [
				{
					msg: 'Customer not exists.',
				},
			],
		})
	}

	const { default_account_id: defaultAccountId } = customer

	Promise.all([
		DebtCollection.find(
			{ lender_default_account: defaultAccountId },
			{ __v: 0 }
		),
		DebtCollection.find(
			{ borrower_default_account: defaultAccountId },
			{ __v: 0 }
		),
	])
		.then(([debtCollectionsLoan, debtCollectionsDebt]) => {
			const response = {
				msg: 'Debt collections successfully got.',
				data: {
					loan: debtCollectionsLoan,
					debt: debtCollectionsDebt,
				},
			}
			return res.status(200).json(response)
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		})
})

// @route     GET /customers/transaction-history
// @desc      View transaction history of customer account
// @access    Private (customer)
router.get('/transaction-history', auth, async (req, res) => {
	const customer = await Customer.findById(req.user.id)
	if (!customer) {
		return res
			.status(400)
			.json({ errors: [{ msg: 'Customer does not exist.' }] })
	}
	const { default_account_id: defaultAccountId } = customer
	Promise.all([
		Transaction.find(
			{
				$or: [
					{
						to_account_id: defaultAccountId,
						transaction_type: 'RECEIVE',
					},
					{
						to_account_id: defaultAccountId,
						transaction_type: 'RECHARGE',
					},
				],
			},
			{ _id: 0, __v: 0 }
		),
		Transaction.find(
			{
				from_account_id: defaultAccountId,
				transaction_type: 'TRANSFER',
			},
			{ _id: 0, __v: 0 }
		),
		Transaction.find(
			{
				$or: [
					{
						from_account_id: defaultAccountId,
						transaction_type: 'REPAYMENT',
					},
					{
						to_account_id: defaultAccountId,
						transaction_type: 'REPAYMENT',
					},
				],
			},
			{ _id: 0, __v: 0 }
		),
	])
		.then(
			([transactionsReceive, transactionsTransfer, transactionsRepayment]) => {
				const response = {
					msg: 'Information page successfully initialized.',
					data: {
						receive: transactionsReceive,
						transfer: transactionsTransfer,
						debt_repaying: transactionsRepayment,
					},
				}
				return res.status(200).json(response)
			}
		)
		.catch((error) => {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		})
})

// @route     PUT /customers/change-password
// @desc      Change password customer
// @access    Private (customer)
router.put(
	'/change-password',
	[
		auth,
		check('oldPassword', 'Please include a valid password').isLength({
			min: 8,
		}),
		check('newPassword', 'Please include a valid password').isLength({
			min: 8,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { oldPassword, newPassword } = req.body

		try {
			if (newPassword === oldPassword) {
				return res.status(400).json({
					errors: [{ msg: 'New password cannot coincide with old password.' }],
				})
			}

			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			const isMatch = await bcrypt.compare(oldPassword, customer.password)
			if (!isMatch) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Old password is incorrect.',
						},
					],
				})
			}

			const salt = await bcrypt.genSalt(10)
			customer.password = await bcrypt.hash(newPassword, salt)

			await customer.save()

			return res.status(200).json({ msg: 'Password successfully changed.' })
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     POST /customers/send-password-otp
// @desc      Send OTP to email which supports to reset password
// @access    Public
router.post(
	'/send-password-otp',
	[check('email', 'Please include a valid email').isEmail()],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { email } = req.body

		try {
			const customer = await Customer.findOne({ email })

			if (!customer) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Customer does not exist.',
						},
					],
				})
			}

			const nanoidPassword = await customAlphabet('1234567890', 6)
			const otpCode = nanoidPassword()

			await sendOTPCode(email, customer.full_name, otpCode, 'forgotPassword')

			customer.OTP.code = otpCode
			customer.OTP.expired_at = Date.now() + 300000
			customer.OTP.is_confirmed = false
			customer.OTP.is_used = false
			await customer.save()

			const response = { msg: 'OTP successfully sent.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     POST /customers/send-password-otp
// @desc      Check OTP for resetting password
// @access    Public
router.post(
	'/validate-password-otp',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('otp', 'Please include a valid OTP').isLength({ min: 6, max: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { email, otp } = req.body

		try {
			const customer = await Customer.findOne({ email })
			if (!customer) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Customer does not exist.',
						},
					],
				})
			}

			if (customer.OTP.is_used !== false) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP is only used once.',
						},
					],
				})
			}

			if (otp !== customer.OTP.code) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP code is invalid.',
						},
					],
				})
			}

			if (customer.OTP.expired_at < Date.now()) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP code has expired.',
						},
					],
				})
			}

			customer.OTP.is_confirmed = true
			customer.OTP.expired_at = Date.now() + 300000
			customer.save()

			const response = { msg: 'OTP is successfully passed.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /customers/reset-password
// @desc      Reset password for customer
// @access    Public
router.put(
	'/reset-password',
	[
		check('email', 'Please include a valid email').not().notEmpty(),
		check('newPassword', 'Please include a valid password').isLength({
			min: 8,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { email, newPassword } = req.body

		try {
			const customer = await Customer.findOne({ email })

			if (!customer) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Customer does not exist.',
						},
					],
				})
			}

			if (customer.OTP.is_used !== false) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP is only used once.',
						},
					],
				})
			}

			if (customer.OTP.is_confirmed !== true) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP is not be confirmed.',
						},
					],
				})
			}

			if (customer.OTP.expired_at < Date.now()) {
				return res.status(400).json({
					errors: [
						{
							msg: 'The reset password timeout has expired.',
						},
					],
				})
			}

			const salt = await bcrypt.genSalt(10)
			customer.password = await bcrypt.hash(newPassword, salt)
			customer.OTP.is_used = true
			await customer.save()

			const response = { msg: 'Password successfully reset.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

module.exports = router
