const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const { sendOTPCode } = require('../../utils/OTP/sendOTP.js')

const DebtCollection = require('../../models/DebtCollection')
const Customer = require('../../models/Customer')
const Transaction = require('../../models/Transaction')
const Account = require('../../models/Account')

// @route     POST /debt-collections/add-debt-collection
// @desc      Add debt collection
// @access    Public
router.post(
	'/add-debt',
	[
		auth,
		check('lenderAccountId', 'Lender account is required').not().notEmpty(),
		check('borrowerAccountId', 'Borrower account is required').not().notEmpty(),
		check('borrowerFullname', 'Borrower full name is required')
			.not()
			.notEmpty(),
		check('debtAmount', 'Please include a valid debt amount').isInt({
			min: 10000,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const {
			borrowerAccountId,
			lenderAccountId,
			borrowerFullname,
			debtAmount,
			debtMessage,
		} = req.body

		try {
			const customer = await Customer.findOne({
				default_account_id: lenderAccountId,
			})
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			const debtCollection = new DebtCollection({
				borrower_default_account: borrowerAccountId,
				borrower_fullname: borrowerFullname,
				lender_default_account: lenderAccountId,
				lender_fullname: customer.full_name,
				debt_status: 'UNPAID',
				debt_amount: debtAmount,
				debt_message: debtMessage || '',
			})

			const debtCollectionResponse = await debtCollection.save()

			const response = {
				msg: 'Debt collection successfully added.',
				data: {
					borrower_default_account:
						debtCollectionResponse.borrower_default_account,
					borrower_fullname: debtCollectionResponse.borrower_fullname,
					lender_default_account: debtCollectionResponse.lender_default_account,
					lender_fullname: debtCollectionResponse.lender_fullname,
					debt_status: debtCollectionResponse.debt_status,
					debt_amount: debtCollectionResponse.debt_amount,
					debt_message: debtCollectionResponse.debt_message,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     POST /debt-collections/all-debt-collections
// @desc      Get all debt collection of current customer
// @access    Public
router.get('/all-debt', auth, async (req, res) => {
	try {
		const customer = await Customer.findById(req.user.id)
		if (!customer) {
			return res.status(400).json({
				errors: [{ msg: 'Customer not exists.' }],
			})
		}

		const debtCollection = await DebtCollection.find({
			$or: [
				{ borrower_default_account: customer.default_account_id },
				{ lender_default_account: customer.default_account_id },
			],
		})

		const response = {
			msg: 'Debt collections successfully got.',
			data: {
				loan: debtCollection
					.filter(
						(e) => e.lender_default_account === customer.default_account_id
					)
					.map((e) => {
						return {
							debt_collection_id: e._id,
							borrower_default_account: e.borrower_default_account,
							borrower_fullname: e.borrower_fullname,
							lender_default_account: e.lender_default_account,
							lender_fullname: e.lender_fullname,
							debt_status: e.debt_status,
							debt_amount: e.debt_amount,
							debt_message: e.debt_message,
							debt_reason_cancel: e.debt_reason_cancel,
						}
					}),
				debt: debtCollection
					.filter(
						(e) => e.borrower_default_account === customer.default_account_id
					)
					.map((e) => {
						return {
							debt_collection_id: e._id,
							borrower_default_account: e.borrower_default_account,
							borrower_fullname: e.borrower_fullname,
							lender_default_account: e.lender_default_account,
							lender_fullname: e.lender_fullname,
							debt_status: e.debt_status,
							debt_amount: e.debt_amount,
							debt_message: e.debt_message,
							debt_reason_cancel: e.debt_reason_cancel,
						}
					}),
			},
		}
		return res.status(200).json(response)
	} catch (error) {
		return res.status(500).json({ msg: 'Server error...' })
	}
})

// @route     PUT /debt-collections/cancel-debt-collection
// @desc      Cancel debt collections
// @access    Public
router.put(
	'/cancel-debt',
	[
		auth,
		check('debtCollectionId', 'Debt collection id is required')
			.not()
			.notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { debtCollectionId, debtReasonCancel } = req.body

		try {
			const debtCollection = await DebtCollection.findById(debtCollectionId)

			debtCollection.debt_status = 'CANCELLED'
			debtCollection.debt_reason_cancel = debtReasonCancel || ''
			debtCollection.save()

			const response = { msg: 'Debt collection successfully cancelled' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     POST /transactions/send-repayment-otp
// @desc      Send OTP to email which supports to confirm repayment
// @access    Public
router.post('/send-repayment-otp', auth, async (req, res) => {
	try {
		const customer = await Customer.findById(req.user.id)

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

		await sendOTPCode(customer.email, customer.full_name, otpCode, 'transfer')

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
})

// @route     POST /debt-collections/repayment
// @desc      Send OTP to email which supports to confirm repayment
// @access    Public
router.post(
	'/repayment',
	[
		auth,
		check('otp', 'Please include a valid OTP')
			.isInt()
			.isLength({ min: 6, max: 6 }),
		check('lenderAccountId', 'Lender account is required').not().notEmpty(),
		check('lenderFullname', 'Lender full name is required').not().notEmpty(),
		check('debtAmount', 'Transaction amount is 10000 or more').isInt({
			min: 10000,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { otp, lenderAccountId, lenderFullname, debtAmount } = req.body

		const checkErrorsMongoose = {
			updateTransfererAccount: false,
			createTransfererTransaction: false,
			transfererTransactionFailed: false,
			updateReceiverAccount: false,
		}

		try {
			const borrower = await Customer.findById(req.user.id)
			if (!borrower) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			const accountBorrower = await Account.findOne({
				account_id: borrower.default_account_id,
			})

			const accountLender = await Account.findOne({
				account_id: lenderAccountId,
			})

			if (accountBorrower.balance - debtAmount < 50000) {
				return res.status(400).json({
					errors: [{ msg: 'Insufficient funds.' }],
				})
			}
			if (borrower.OTP.is_used !== false) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP is only used once.',
						},
					],
				})
			}

			if (otp !== borrower.OTP.code) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP code is invalid.',
						},
					],
				})
			}

			if (borrower.OTP.expired_at < Date.now()) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP code has expired.',
						},
					],
				})
			}

			const transactionBorrower = {
				entry_time: Date.now(),
				from_account_id: borrower.default_account_id,
				from_fullname: borrower.full_name,
				to_account_id: lenderAccountId,
				to_fullname: lenderFullname,
				from_bank_id: 'EIGHT',
				to_bank_id: 'EIGHT',
				transaction_type: 'REPAYMENT',
				transaction_amount: debtAmount,
				transaction_balance_before: accountBorrower.balance,
			}

			const transactionLender = new Transaction({
				entry_time: Date.now(),
				from_account_id: borrower.default_account_id,
				from_fullname: borrower.full_name,
				to_account_id: lenderAccountId,
				to_fullname: lenderFullname,
				from_bank_id: 'EIGHT',
				to_bank_id: 'EIGHT',
				transaction_type: 'RECEIVE',
				transaction_amount: debtAmount,
				transaction_balance_before: accountLender.balance,
			})

			const accountTransfererResponse = await Account.findOneAndUpdate(
				{ account_id: borrower.default_account_id },
				{ $inc: { balance: -debtAmount } },
				{ new: true }
			)

			checkErrorsMongoose.updateTransfererAccount = {
				account_id: accountTransfererResponse.account_id,
				transaction_amount: debtAmount,
			}

			const transactionBorrowerResponse = await new Transaction({
				...transactionBorrower,
				transaction_balance_after: accountTransfererResponse.balance,
				transaction_status: 'FAILED',
			}).save()

			checkErrorsMongoose.transfererTransactionFailed = transactionBorrowerResponse

			checkErrorsMongoose.createTransfererTransaction = {
				...transactionBorrower,
				transaction_balance_before: accountTransfererResponse.balance,
				transaction_balance_after: accountBorrower.balance,
				transaction_status: 'REFUND',
			}

			const accountReceiverResponse = await Account.findOneAndUpdate(
				{ account_id: lenderAccountId },
				{ $inc: { balance: debtAmount } },
				{ new: true }
			)

			checkErrorsMongoose.updateReceiverAccount = {
				account_id: accountReceiverResponse.account_id,
				transaction_amount: debtAmount,
			}

			const transactionLenderResponse = await Transaction({
				...transactionLender._doc,
				transaction_balance_after: accountReceiverResponse.balance,
				transaction_status: 'FAILED',
			}).save()

			transactionBorrowerResponse.transaction_status = 'SUCCESS'
			transactionBorrowerResponse.save()

			transactionLenderResponse.transaction_status = 'SUCCESS'
			transactionLenderResponse.save()

			borrower.OTP.is_confirmed = true
			borrower.OTP.is_used = true
			borrower.save()

			const response = {
				msg: 'Debt collection successfully repaid',
				data: {
					entry_time: transactionBorrowerResponse.entry_time,
					from_account_id: transactionBorrowerResponse.from_account_id,
					from_fullname: transactionBorrowerResponse.from_fullname,
					to_account_id: transactionBorrowerResponse.to_account_id,
					to_fullname: transactionBorrowerResponse.to_fullname,
					transaction_type: transactionBorrowerResponse.transaction_type,
					transaction_amount: transactionBorrowerResponse.transaction_amount,
					transaction_balance_before:
						transactionBorrowerResponse.transaction_balance_before,
					transaction_balance_after:
						transactionBorrowerResponse.transaction_balance_after,
					transaction_status: transactionBorrowerResponse.transaction_status,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.updateReceiverAccount !== false) {
				await Account.findOneAndUpdate(
					{ account_id: checkErrorsMongoose.updateReceiverAccount.account_id },
					{
						$inc: {
							balance: -checkErrorsMongoose.updateReceiverAccount
								.transaction_amount,
						},
					},
					{ new: true }
				)
			}

			if (checkErrorsMongoose.updateTransfererAccount !== false) {
				await Account.findOneAndUpdate(
					{
						account_id: checkErrorsMongoose.updateTransfererAccount.account_id,
					},
					{
						$inc: {
							balance:
								checkErrorsMongoose.updateTransfererAccount.transaction_amount,
						},
					},
					{ new: true }
				)
			}

			if (checkErrorsMongoose.createTransfererTransaction !== false) {
				const transfererTransactionRefund = await new Transaction(
					checkErrorsMongoose.createTransfererTransaction
				).save()
				return res.status(500).json({
					msg: 'Server error...',
					data: {
						transaction_failed: {
							entry_time:
								checkErrorsMongoose.transfererTransactionFailed.entry_time,
							from_account_id:
								checkErrorsMongoose.transfererTransactionFailed.from_account_id,
							from_fullname:
								checkErrorsMongoose.transfererTransactionFailed.from_fullname,
							to_account_id:
								checkErrorsMongoose.transfererTransactionFailed.to_account_id,
							to_fullname:
								checkErrorsMongoose.transfererTransactionFailed.to_fullname,
							transaction_type:
								checkErrorsMongoose.transfererTransactionFailed
									.transaction_type,
							transaction_amount:
								checkErrorsMongoose.transfererTransactionFailed
									.transaction_amount,
							transaction_balance_before:
								checkErrorsMongoose.transfererTransactionFailed
									.transaction_balance_before,
							transaction_balance_after:
								checkErrorsMongoose.transfererTransactionFailed
									.transaction_balance_after,
							transaction_status:
								checkErrorsMongoose.transfererTransactionFailed
									.transaction_status,
						},
						transaction_refund: {
							entry_time: transfererTransactionRefund.entry_time,
							from_account_id: transfererTransactionRefund.from_account_id,
							from_fullname: transfererTransactionRefund.from_fullname,
							to_account_id: transfererTransactionRefund.to_account_id,
							to_fullname: transfererTransactionRefund.to_fullname,
							transaction_type: transfererTransactionRefund.transaction_type,
							transaction_amount:
								transfererTransactionRefund.transaction_amount,
							transaction_balance_before:
								transfererTransactionRefund.transaction_balance_before,
							transaction_balance_after:
								transfererTransactionRefund.transaction_balance_after,
							transaction_status:
								transfererTransactionRefund.transaction_status,
						},
					},
				})
			}

			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

module.exports = router
