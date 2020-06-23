const express = require('express')

const router = express.Router()
const auth = require('../../middlewares/auth')

const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')

const Account = require('../../models/Account')
const Customer = require('../../models/Customer')

// @route     POST /accounts/add-saving-account
// @desc      Create saving account
// @access    Public
router.post(
	'/add-saving-account',
	[
		auth,
		check('depositAmount', 'Please enter a balance with 1000000 or more').isInt(
			{
				min: 1000000,
				max: 1000000000000,
			}
		),
		check('depositTerm', 'Please enter a term with 1 week or more').isInt({
			min: 604800000,
		}),
		check('depositInterestRate', 'Interest rate is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { depositAmount, depositInterestRate, depositTerm } = req.body
		const service = Date.now() % 2 === 1 ? 'MASTERCARD' : 'VISA'

		const checkErrorsMongoose = {
			createAccountSaving: false,
			updateAccountDefault: false,
		}

		try {
			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			const { default_account_id: defaultAccountId } = customer

			const defaultAccount = await Account.findOne({
				account_id: defaultAccountId,
			})

			if (depositAmount > defaultAccount.balance - 500000) {
				return res.status(400).json({
					errors: [{ msg: 'Insufficient funds.' }],
				})
			}

			const nanoid = customAlphabet('1234567890', 14)
			const accountId = nanoid()

			const account = new Account({
				account_id: accountId,
				account_type: 'SAVING',
				balance: depositAmount,
				account_service: service,
				created_at: Date.now(),
				term: depositTerm,
				end_time: Date.now() + depositTerm,
				interest_rate: depositInterestRate,
			})

			const responseAccount = await account.save()

			defaultAccount.balance =
				Number(defaultAccount.balance) - Number(depositAmount)
			await defaultAccount.save()

			checkErrorsMongoose.createAccountSaving = {
				account_id: responseAccount.account_id,
			}

			customer.saving_accounts_id.push(responseAccount._id)
			await customer.save()

			checkErrorsMongoose.updateAccountDefault = {
				account_id: defaultAccount.account_id,
				deposit_amount: depositAmount,
			}

			const response = {
				msg: 'Saving account successfully created',
				data: {
					_id: responseAccount._id,
					account_id: responseAccount.account_id,
					account_type: responseAccount.account_type,
					balance: responseAccount.balance,
					account_service: responseAccount.account_service,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.createAccountSaving !== false) {
				await Account.findOneAndRemove({
					account_id: checkErrorsMongoose.createAccountSaving.account_id,
				})
			}

			if (checkErrorsMongoose.updateAccountDefault !== false) {
				await Account.findOneAndUpdate(
					{
						account_id: checkErrorsMongoose.updateAccountDefault.account_id,
					},
					{
						$inc: {
							balance: checkErrorsMongoose.updateAccountDefault.deposit_amount,
						},
					},
					{ new: true }
				)
			}

			console.log(error)
			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

// @route     DELETE /accounts/delete-saving-account
// @desc      Delete saving account
// @access    Public
router.delete(
	'/delete-saving-account',
	[auth, check('depositId', 'Deposit id is required').not().notEmpty()],
	async (req, res) => {
		const errors = validationResult(req)
		if (errors) {
			if (!errors.isEmpty()) {
				return res.status(400).send(errors)
			}
		}

		const { depositId } = req.query

		const checkErrorsMongoose = {
			updateDefaultAccount: false,
		}

		try {
			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer does not exists.' }],
				})
			}

			const inxItem = customer.saving_accounts_id.indexOf(depositId)
			console.log(inxItem)

			if (inxItem === -1) {
				return res.status(400).json({
					errors: [{ msg: 'Deposit does not yours.' }],
				})
			}

			const depositAccount = await Account.findById(depositId)
			if (!depositAccount) {
				return res.status(400).json({
					errors: [{ msg: 'Deposit does not exist.' }],
				})
			}

			await Account.findOneAndUpdate(
				{
					account_id: customer.default_account_id,
				},
				{
					$inc: {
						balance: depositAccount.balance,
					},
				},
				{ new: true }
			)

			checkErrorsMongoose.updateDefaultAccount = {
				account_id: customer.default_account_id,
				deposit_amount: depositAccount.balance,
			}

			await Account.findByIdAndDelete(depositId)

			customer.saving_accounts_id.splice(inxItem, 1)
			await customer.save()

			const response = {
				msg: 'Deposit successfully deleted.',
				data: { _id: depositId },
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.updateDefaultAccount !== false) {
				await Account.findOneAndUpdate(
					{
						account_id: checkErrorsMongoose.updateAccountDefault.account_id,
					},
					{
						$inc: {
							balance: -checkErrorsMongoose.updateAccountDefault.deposit_amount,
						},
					},
					{ new: true }
				)
			}

			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     POST /accounts/complete-saving-account
// @desc      Complete saving account
// @access    Public
router.post(
	'/complete-saving-account',
	[auth, check('depositId', 'Deposit id is required').not().notEmpty()],
	async (req, res) => {
		const errors = validationResult(req)
		if (errors) {
			if (!errors.isEmpty()) {
				return res.status(400).send(errors)
			}
		}

		const { depositId } = req.body

		const checkErrorsMongoose = {
			updateDefaultAccount: false,
		}

		try {
			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer does not exists.' }],
				})
			}

			const inxItem = customer.saving_accounts_id.indexOf(depositId)
			console.log(inxItem)
			if (inxItem === -1) {
				return res.status(400).json({
					errors: [{ msg: 'Deposit is not yours.' }],
				})
			}

			const depositAccount = await Account.findById(depositId)
			if (!depositAccount) {
				return res.status(400).json({
					errors: [{ msg: 'Deposit does not exist.' }],
				})
			}

			if (Date.now() < depositAccount.end_time) {
				return res.status(400).json({
					errors: [{ msg: 'Deposit is not be completed.' }],
				})
			}

			await Account.findOneAndUpdate(
				{
					account_id: customer.default_account_id,
				},
				{
					$inc: {
						balance:
							depositAccount.balance +
							depositAccount.balance *
								(depositAccount.term / 29030400000) *
								depositAccount.interest_rate,
					},
				},
				{ new: true }
			)

			checkErrorsMongoose.updateDefaultAccount = {
				account_id: customer.default_account_id,
				deposit_amount: depositAccount.balance,
			}

			await Account.findByIdAndDelete(depositId)

			customer.saving_accounts_id.splice(inxItem, 1)
			await customer.save()

			const response = {
				msg: 'Deposit successfully deleted.',
				data: { _id: depositId },
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.updateDefaultAccount !== false) {
				await Account.findOneAndUpdate(
					{
						account_id: checkErrorsMongoose.updateAccountDefault.account_id,
					},
					{
						$inc: {
							balance: -checkErrorsMongoose.updateAccountDefault.deposit_amount,
						},
					},
					{ new: true }
				)
			}

			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

module.exports = router
