const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Account = require('../../models/Account')
const Customer = require('../../models/Customer')

// @route     POST /accounts
// @desc      Tạo tài khoản ngân hàng với loại tiết kiệm cho một customer
// @access    Public
router.post(
	'/register',
	[
		auth,
		check('balance', 'Please enter a balance with 0 or more').isInt({ min: 0 }),
		check('email', 'Please include a valid email').isEmail(),
		check('phoneNumber', 'Please include a valid phone number').isLength({
			min: 10,
			max: 10,
		}),
		check('defaultAccountId', 'Default account id is required')
			.not()
			.notEmpty(),
		check('service', 'Service is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { position } = req.user
		if (!position) {
			return res.status(403).json({
				errors: [{ msg: 'You not have permission to access' }],
			})
		}

		const { balance, email, phoneNumber, defaultAccountId, service } = req.body

		try {
			const customer = await Customer.findOne({
				email,
				phone_number: phoneNumber,
				default_account_id: defaultAccountId,
			})

			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists' }],
				})
			}

			if (service !== 'VISA' && service !== 'MASTERCARD') {
				return res.status(400).json({
					errors: [
						{
							msg: 'Service does not exist',
						},
					],
				})
			}

			const nanoid = customAlphabet('1234567890', 14)
			const accountId = nanoid()

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
				account_type: 'SAVING',
				balance,
				account_service: service,
			})

			const responseAccount = await account.save()

			customer.saving_accounts_id.push(responseAccount.account_id)
			await customer.save()

			const response = {
				msg: 'Saving account successfully created',
				data: {
					account_id: responseAccount.account_id,
					account_type: responseAccount.account_type,
					balance: responseAccount.balance,
					account_service: responseAccount.account_service,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

// @route     GET /accounts
// @desc      Lấy thông tin tài khoản ngân hàng
// @access    Public
router.get('/', auth, async (req, res) => {
	return res.status(200).json({ msg: 'GET /accounts' })
})

// @route     PUT /accounts
// @desc      Cập nhật số tiền dư của tài khoản ngân hàng
// @access    Public
router.put('/', async (req, res) => {
	try {
		res.status(200).json({ msg: 'PUT /accounts' })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

module.exports = router
