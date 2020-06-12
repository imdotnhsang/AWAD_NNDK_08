const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Customer = require('../../models/Customer')
const Receiver = require('../../models/Receiver')
const LinkedBank = require('../../models/LinkedBank')

// @route     POST /receives/add-receiver
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

			if (bankId !== 'EIGHT.Bank' && !linkedBank) {
				return res.status(400).json({
					errors: [{ msg: 'Bank does not exist.' }],
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
					_id: responseReceiver._id,
					nickname: responseReceiver.nickname,
					full_name: responseReceiver.full_name,
					account_id: responseReceiver.account_id,
					bank_name: responseReceiver.bank_name,
					bank_id: responseReceiver.bank_id,
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

// @route     PUT /receives/update-receiver
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
					_id: responseReceiver._id,
					nickname: responseReceiver.nickname,
					full_name: responseReceiver.full_name,
					account_id: responseReceiver.account_id,
					bank_name: responseReceiver.bank_name,
					bank_id: responseReceiver.bank_id,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     DELETE /receives/delete-receiver
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

		const { receiverId } = req.query

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

			const response = {
				msg: 'Receiver successfully deleted.',
				data: { _id: receiverId },
			}
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

module.exports = router
