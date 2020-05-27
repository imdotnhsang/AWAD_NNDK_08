const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')

const Customer = require('../../models/Customer')
const Account = require('../../models/Account')

// @route     POST /customers
// @desc      Đăng kí customer mới
// @access    Public
router.post(
	'/',
	[
		check('fullName', 'Full name is required').not().notEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('phoneNumber', 'Please include a valid phone number').isLength({
			min: 10,
			max: 10,
		}),
		check('balance', 'Please enter a balance with 50000 or more').isInt({
			min: 50000,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { fullName, email, phoneNumber, balance } = req.body

		const nanoidAccountId = customAlphabet('1234567890', 14)
		const accountId = nanoidAccountId()

		const checkErrorsMongoose = {
			createAccountDefault: false,
		}

		try {
			const isExist = await Customer.countDocuments({
				$or: [{ email }, { phone_number: phoneNumber }],
			})

			if (isExist) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Email or phone number already exists',
						},
					],
				})
			}

			let account = await Account.findOne({ account_id: accountId })

			if (account) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Account already exists',
						},
					],
				})
			}

			account = new Account({
				account_id: accountId,
				account_type: 'DEFAULT',
				balance,
			})

			const responseAccountPost = await account.save()

			checkErrorsMongoose.createAccountDefault = {
				account_id: responseAccountPost.account_id,
			}

			const defaultAccountId = responseAccountPost.account_id

			const nanoidPassword = customAlphabet(
				'1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
				8
			)
			const password = nanoidPassword()

			const customer = new Customer({
				full_name: fullName,
				email: email.toLowerCase(),
				phone_number: phoneNumber,
				password,
				default_account_id: defaultAccountId,
				created_at: Date.now(),
			})

			const salt = await bcrypt.genSalt(10)
			customer.password = await bcrypt.hash(password, salt)

			const response = await customer.save()

			return res.status(200).json({
				response,
				customer: {
					email,
					password,
				},
			})
		} catch (error) {
			if (checkErrorsMongoose.createAccountDefault !== false) {
				await Account.findOneAndRemove({
					account_id: checkErrorsMongoose.createAccountDefault.account_id,
				})
			}

			return res.status(500).send('Server error')
		}
	}
)

// @route     GET /customers
// @desc      Lấy thông tin của customer
// @access    Public
router.get('/', async (req, res) => {
	return res.status(200).json({ msg: 'GET /customers' })
})

// @route     PUT /customers
// @desc      Cập nhật thông tin customer
// @access    Public
router.put('/', async (req, res) => {
	return res.status(200).json({ msg: 'PUT /customers' })
})

module.exports = router
