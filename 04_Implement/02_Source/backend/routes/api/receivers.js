const express = require('express')

const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Receiver = require('../../models/Receiver')
const Customer = require('../../models/Customer')

router.post(
	'/add',
	[
		auth,
		check('bankName', 'Bank name is required').not().notEmpty(),
		check('bankId', 'Bank id is required').not().notEmpty(),
		check('accountId', 'Account id is required').not().notEmpty(),
		check('nickname', 'Nickname is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (errors) {
			if (!errors.isEmpty()) {
				return res.status(400).send(errors)
			}
		}

		const { bankName, bankId, accountId, nickname } = req.body

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

			const receiver = new Receiver({
				bank_id: bankId,
				bank_name: bankName,
				account_id: accountId,
				nickname,
			})

			const responseReceiver = await receiver.save()

			checkErrorsMongoose.createReceiver = {
				id: responseReceiver._id,
			}

			customer.list_receivers_id.push(responseReceiver._id)
			await customer.save()

			return res.status(200).json({
				msg: 'Receiver successfully added',
				data: {
					nickname: responseReceiver.nickname,
					account_id: responseReceiver.account_id,
					bank_name: responseReceiver.bank_name,
				},
			})
		} catch (error) {
			if (checkErrorsMongoose.createAccountDefault !== false) {
				await Receiver.findByIdAndRemove(checkErrorsMongoose.createReceiver.id)
			}

			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

module.exports = router
