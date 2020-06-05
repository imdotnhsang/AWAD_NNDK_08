const express = require('express')
// const mongoose = require('mongoose')

const router = express.Router()
// const { check, validationResult } = require('express-validator')
// const auth = require('../../middlewares/auth')

// const Receiver = require('../../models/Receiver')
// const Customer = require('../../models/Customer')
// const LinkedBank = require('../../models/LinkedBank')

// router.post(
// 	'/add',
// 	[
// 		auth,
// 		check('bankName', 'Bank name is required').not().notEmpty(),
// 		check('bankId', 'Bank id is required').not().notEmpty(),
// 		check('accountId', 'Account id is required').not().notEmpty(),
// 		check('nickname', 'Nickname is required').not().notEmpty(),
// 	],
// 	async (req, res) => {
// 		const errors = validationResult(req)
// 		if (errors) {
// 			if (!errors.isEmpty()) {
// 				return res.status(400).send(errors)
// 			}
// 		}

// 		const { bankName, bankId, accountId, nickname } = req.body

// 		const userId = req.user.id

// 		const checkErrorsMongoose = {
// 			createReceiver: false,
// 		}
// 		try {
// 			const customer = await Customer.findById(userId)

// 			if (!customer) {
// 				return res.status(400).json({
// 					errors: [{ msg: 'Customer not exists.' }],
// 				})
// 			}

// 			if (accountId === customer.default_account_id) {
// 				return res.status(400).json({
// 					errors: [
// 						{ msg: 'Beneficiary account cannot coincide with debit account.' },
// 					],
// 				})
// 			}

// 			const list_accountReceivers_id = (
// 				await Receiver.find({
// 					_id: {
// 						$in: customer.list_receivers_id.map((e) =>
// 							mongoose.Types.ObjectId(e)
// 						),
// 					},
// 				})
// 			).map((e) => e.account_id)

// 			if (list_accountReceivers_id.indexOf(accountId) !== -1) {
// 				return res.status(400).json({
// 					errors: [{ msg: 'Account exists.' }],
// 				})
// 			}
// 			const linkedBank = await LinkedBank.findOne({ bank_id: bankId })

// 			if (bankId !== 'EIGHT' && !linkedBank) {
// 				return res.status(400).json({
// 					errors: [{ msg: 'Bank is not connected.' }],
// 				})
// 			}

// 			const receiver = new Receiver({
// 				bank_id: bankId,
// 				bank_name: bankName,
// 				account_id: accountId,
// 				nickname,
// 			})

// 			const responseReceiver = await receiver.save()

// 			checkErrorsMongoose.createReceiver = {
// 				id: responseReceiver._id,
// 			}

// 			customer.list_receivers_id.push(responseReceiver._id)
// 			await customer.save()

// 			const response = {
// 				msg: 'Receiver successfully added.',
// 				data: {
// 					nickname: responseReceiver.nickname,
// 					account_id: responseReceiver.account_id,
// 					bank_name: responseReceiver.bank_name,
// 				},
// 			}
// 			return res.status(200).json(response)
// 		} catch (error) {
// 			if (checkErrorsMongoose.createAccountDefault !== false) {
// 				await Receiver.findByIdAndRemove(checkErrorsMongoose.createReceiver.id)
// 			}

// 			return res.status(500).json({ msg: 'Server error...' })
// 		}
// 	}
// )

module.exports = router
