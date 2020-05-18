const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')

const { MakeResponse } = require('../../utils/APIStatus.js')
const customerAction = require('../../action/customer.js')

const Customer = require('../../models/Customer')
const Account = require('../../models/Account')

// @route     POST /customers
// @desc      Đăng kí customer mới
// @access    Public
router.post('/', [
	check('fullName', 'Full name is required').not().notEmpty(),
	check('email', 'Please include a valid email').isEmail(),
	check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
	check('balance', 'Please enter a balance with 50000 or more').isInt({ min: 50000 })
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		fullName,
		email,
		phoneNumber,
		password,
		role,
		balance
	} = req.body
	const accountType = 'DEFAULT'

	const nanoid = customAlphabet('1234567890', 14)
	const accountId = nanoid()

	try {
		let customer = await Customer.findOne({ email })

		if (customer) {
			res.status(400).json({
				errors: [{
					msg: 'Email already exists'
				}]
			})
		}

		customer = undefined
		customer = await Customer.findOne({ phone_number: phoneNumber })

		if (customer) {
			res.status(400).json({
				errors: [{
					msg: 'Phone number already exists'
				}]
			})
		}

		let account = await Account.findOne({ account_id: accountId })

		if (account) {
			res.status(400).json({
				errors: [{
					msg: 'Account already exists'
				}]
			})
		}

		account = new Account({ account_id: accountId, account_type: accountType, balance })

		const responseAccountPost = await account.save()

		try {
			const defaultAccountId = responseAccountPost.account_id

			customer = new Customer({
				full_name: fullName, email, phone_number: phoneNumber, password, role, default_account_id: defaultAccountId
			})

			const salt = await bcrypt.genSalt(10)

			customer.password = await bcrypt.hash(password, salt)

			const response = await customer.save()

			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).send('Server error')
		}
	} catch (error) {
		return res.status(500).send('Server error')
	}
})

// @route     GET /customers
// @desc      Lấy thông tin của customer
// @access    Public
router.get('/', async (req, res) => {
	const customer = {
		role: 'CUSTOMER'
	}

	const response = await customerAction.getCustomer(customer, null, 0, 1000, true, true)

	return res.status(200).json(response)
})

// @route     PUT /customers
// @desc      Cập nhật thông tin customer
// @access    Public
router.put('/', async (req, res) => {
	const input = {
		role: 'CUSTOMER',
		full_name: 'Sơn'
	}

	const response = await customerAction.updateCustomer(input)
	return MakeResponse(req, res, response)
})

module.exports = router
