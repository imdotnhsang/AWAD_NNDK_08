const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Customer = require('../../models/Customer')
const Account = require('../../models/Account')
const Receiver = require('../../models/Receiver')
const LinkedBank = require('../../models/LinkedBank')
const Transaction = require('../../models/Transaction')

// @route     GET /customers/init-page
// @desc      Get all information of customer page
// @access    Public
router.get('/init-page', auth, async (req, res) => {
	try {
		const customer = await Customer.findById(req.user.id)
		if (!customer) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Customer not exists',
					},
				],
			})
		}

		const {
			default_account_id: defaultAccountId,
			saving_accounts_id: savingAccountsId,
			list_receiver_id: listReceiverId,
		} = customer

		const savingAccounts = (
			await Account.find({
				account_id: {
					$in: savingAccountsId.map((e) => e),
				},
			})
		).map((e) => {
			return {
				account_id: e.account_id,
				account_type: e.account_type,
				balance: e.balance,
				account_service: e.account_service,
			}
		})

		const defaultAccount = await Account.findOne({
			account_id: defaultAccountId,
		})

		const listReceiver = (
			await Receiver.find({
				_id: {
					$in: listReceiverId.map((e) => mongoose.Types.ObjectId(e)),
				},
			})
		).map((e) => {
			return {
				receiver_id: e._id,
				bank_name: e.bank_name,
				account_id: e.account_id,
				full_name: e.full_name,
				nickname: e.nickname,
			}
		})

		const transactionHistory = await Transaction.find({
			$or: [
				{ from_account_id: defaultAccountId },
				{ to_account_id: defaultAccountId },
			],
		})

		const response = {
			msg: 'Information page successfully initialized',
			data: {
				personal_info: {
					full_name: customer.full_name,
					phone_number: customer.phone_number,
					email: customer.email,
				},
				card_info: {
					default_account: {
						account_id: defaultAccount.account_id,
						account_type: defaultAccount.account_type,
						balance: defaultAccount.balance,
						account_service: defaultAccount.account_service,
					},
					saving_accounts: savingAccounts,
				},
				receiver_info: listReceiver,
				transaction_info: {
					receive: transactionHistory
						.filter(
							(e) =>
								e.transaction_type === 'RECEIVE' ||
								e.transaction_type === 'RECHARGE'
						)
						.map((e) => {
							return {
								entry_time: e.entry_time,
								from_bank_id: e.from_bank_id,
								to_bank_id: e.to_bank_id,
								from_account_id: e.from_account_id,
								from_fullname: e.from_fullname,
								to_account_id: e.to_account_id,
								to_fullname: e.to_fullname,
								transaction_type: e.transaction_type,
								transaction_amount: e.transaction_amount,
								transaction_status: e.transaction_status,
							}
						}),
					transfer: transactionHistory
						.filter((e) => e.transaction_type === 'TRANSFER')
						.map((e) => {
							return {
								entry_time: e.entry_time,
								from_bank_id: e.from_bank_id,
								to_bank_id: e.to_bank_id,
								from_account_id: e.from_account_id,
								from_fullname: e.from_fullname,
								to_account_id: e.to_account_id,
								to_fullname: e.to_fullname,
								transaction_type: e.transaction_type,
								transaction_amount: e.transaction_amount,
								transaction_status: e.transaction_status,
							}
						}),
					debt: transactionHistory
						.filter((e) => e.transaction_type === 'REPAYMENT')
						.map((e) => {
							return {
								entry_time: e.entry_time,
								from_bank_id: e.from_bank_id,
								to_bank_id: e.to_bank_id,
								from_account_id: e.from_account_id,
								from_fullname: e.from_fullname,
								to_account_id: e.to_account_id,
								to_fullname: e.to_fullname,
								transaction_type: e.transaction_type,
								transaction_amount: e.transaction_amount,
								transaction_status: e.transaction_status,
							}
						}),
				},
			},
		}

		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     POST /customers/add-receiver
// @desc      Add receiver to list receiver which is received payment
// @access    Public
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
					errors: [{ msg: 'Customer not exists' }],
				})
			}

			const linkedBank = await LinkedBank.findOne({ bank_id: bankId })

			if (bankId !== 'EIGHT' && !linkedBank) {
				return res.status(400).json({
					errors: [{ msg: 'Bank is not connected' }],
				})
			}

			if (accountId === customer.default_account_id) {
				return res.status(400).json({
					errors: [
						{ msg: 'Beneficiary account cannot coincide with debit account' },
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
					errors: [{ msg: 'Account exists' }],
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
				msg: 'Receiver successfully added',
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

			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

// @route     PUT /customers/update-receiver
// @desc      Update information receiver
// @access    Public
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
					errors: [{ msg: 'Customer not exists' }],
				})
			}

			if (customer.list_receiver_id.indexOf(receiverId) === -1) {
				return res.status(400).json({
					errors: [{ msg: 'Receiver not exists' }],
				})
			}

			const receiver = await Receiver.findById(receiverId)
			if (nickname === receiver.nickname) {
				return res.status(400).json({
					errors: [{ msg: 'New nickname cannot coincide with old nickname' }],
				})
			}

			receiver.nickname = nickname
			const responseReceiver = await receiver.save()

			const response = {
				msg: 'Receiver successfully updated',
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
			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

// @route     DELETE /customers/delete-receiver
// @desc      Delete receiver from list receiver
// @access    Public
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
					errors: [{ msg: 'Customer not exists' }],
				})
			}

			const inxItem = customer.list_receiver_id.indexOf(receiverId)

			if (inxItem === -1) {
				return res.status(400).json({
					errors: [{ msg: 'Receiver not exists' }],
				})
			}

			await Receiver.findByIdAndDelete(receiverId)

			customer.list_receiver_id.splice(inxItem, 1)
			await customer.save()

			const response = { msg: 'Receiver successfully deleted' }
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

// @route     GET /customers/transaction-history
// @desc      View transaction history of customer account
// @access    Public
router.get('/transaction-history', auth, async (req, res) => {
	try {
		const customer = await Customer.findById(req.user.id)
		if (!customer) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Customer does not exist' }] })
		}

		const transactionHistory = await Transaction.find({
			$or: [
				{ from_account_id: customer.default_account_id },
				{ to_account_id: customer.default_account_id },
			],
		})

		const response = {
			msg: 'Transaction history successfully got',
			data: {
				receive: transactionHistory
					.filter(
						(e) =>
							e.transaction_type === 'RECEIVE' ||
							e.transaction_type === 'RECHARGE'
					)
					.map((e) => {
						return {
							entry_time: e.entry_time,
							from_bank_id: e.from_bank_id,
							to_bank_id: e.to_bank_id,
							from_account_id: e.from_account_id,
							from_fullname: e.from_fullname,
							to_account_id: e.to_account_id,
							to_fullname: e.to_fullname,
							transaction_type: e.transaction_type,
							transaction_amount: e.transaction_amount,
							transaction_status: e.transaction_status,
						}
					}),
				transfer: transactionHistory
					.filter((e) => e.transaction_type === 'TRANSFER')
					.map((e) => {
						return {
							entry_time: e.entry_time,
							from_bank_id: e.from_bank_id,
							to_bank_id: e.to_bank_id,
							from_account_id: e.from_account_id,
							from_fullname: e.from_fullname,
							to_account_id: e.to_account_id,
							to_fullname: e.to_fullname,
							transaction_type: e.transaction_type,
							transaction_amount: e.transaction_amount,
							transaction_status: e.transaction_status,
						}
					}),
				debt: transactionHistory
					.filter((e) => e.transaction_type === 'REPAYMENT')
					.map((e) => {
						return {
							entry_time: e.entry_time,
							from_bank_id: e.from_bank_id,
							to_bank_id: e.to_bank_id,
							from_account_id: e.from_account_id,
							from_fullname: e.from_fullname,
							to_account_id: e.to_account_id,
							to_fullname: e.to_fullname,
							transaction_type: e.transaction_type,
							transaction_amount: e.transaction_amount,
							transaction_status: e.transaction_status,
						}
					}),
			},
		}
		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /customers/cards-information
// @desc      Get all information of customer page
// @access    Public
router.get('/cards-information', auth, async (req, res) => {
	try {
		const customer = await Customer.findById(req.user.id)
		if (!customer) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Customer not exists',
					},
				],
			})
		}

		const {
			default_account_id: defaultAccountId,
			saving_accounts_id: savingAccountsId,
		} = customer

		const savingAccounts = (
			await Account.find({
				account_id: {
					$in: savingAccountsId.map((e) => e),
				},
			})
		).map((e) => {
			return {
				account_id: e.account_id,
				account_type: e.account_type,
				balance: e.balance,
				account_service: e.account_service,
			}
		})

		const defaultAccount = await Account.findOne({
			account_id: defaultAccountId,
		})

		const response = {
			msg: 'Cards information successfully got',
			data: {
				default_account: {
					account_id: defaultAccount.account_id,
					account_type: defaultAccount.account_type,
					balance: defaultAccount.balance,
					account_service: defaultAccount.account_service,
				},
				saving_accounts: savingAccounts,
			},
		}

		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     PUT /customers/change-password
// @desc      Change password customer
// @access    Public
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
					errors: [{ msg: 'New password cannot coincide with old password' }],
				})
			}

			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists' }],
				})
			}

			const isMatch = await bcrypt.compare(oldPassword, customer.password)
			if (!isMatch) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Old password is incorrect',
						},
					],
				})
			}

			const salt = await bcrypt.genSalt(10)
			customer.password = await bcrypt.hash(newPassword, salt)

			await customer.save()

			return res.status(200).json({ msg: 'Password successfully changed' })
		} catch (error) {
			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

module.exports = router
