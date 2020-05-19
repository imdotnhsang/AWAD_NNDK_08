const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Account = require('../../models/Account')
const Customer = require('../../models/Customer')

// @route     POST /accounts
// @desc      Tạo tài khoản ngân hàng với loại tiết kiệm cho một customer dựa trên default_account_id
// @access    Public
router.post('/', [
	check('balance', 'Please enter a balance with 0 or more').isInt({ min: 0 }),
	check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const { balance, email } = req.body

	const nanoid = customAlphabet('1234567890', 14)
	const accountId = nanoid()

	const checkErrorsMongoose = {
		createSavingAccount: false
	}

	try {
		const customer = await Customer.findOne({ email })

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const account = new Account({ account_id: accountId, account_type: 'SAVING', balance })

		const responseAccount = await account.save()

		checkErrorsMongoose.createSavingAccount = { account_by_id: responseAccount._id }

		customer.saving_account_id.push(responseAccount.account_id)
		const updatedCustomer = await customer.save()

		return res.status(200).json({ responseAccount, updatedCustomer })
	} catch (error) {
		if (checkErrorsMongoose.createSavingAccount.account_by_id !== false) {
			await Account.findByIdAndRemove(checkErrorsMongoose.createSavingAccount.account_by_id)
		}

		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /accounts
// @desc      Lấy thông tin tài khoản ngân hàng
// @access    Public
router.get('/', auth, async (req, res) => {
	try {
		const customer = (await Customer.findById(req.user.id))

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const { full_name: fullName, default_account_id: defaultAccountId, saving_account_id: savingAccountsId } = customer

		let savingAccounts = []
		if (savingAccountsId.length !== 0) {
			savingAccountsId.map(async (e) => savingAccounts.push(await Account.findOne({ account_id: e })))
		}

		const defaultAccount = await Account.findOne({ account_id: defaultAccountId })

		return res.status(200).json({ fullName, defaultAccount, savingAccounts })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     PUT /accounts
// @desc      Cập nhật số tiền dư của tài khoản ngân hàng
// @access    Public
router.put('/', async (req, res) => {
	try {
		res.status(200).json({ msg: 'PUT /accounts' })
	} catch (error) {
		res.status(500).json({ msg: 'Server error' })
	}
})

module.exports = router
