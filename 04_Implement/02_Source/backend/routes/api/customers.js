const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Customer = require('../../models/Customer')
const Account = require('../../models/Account')
const Receiver = require('../../models/Receiver')

// @route     POST /customers
// @desc      Đăng kí customer mới
// @access    Public
router.post(
	'/register',
	[
		auth,
		check('fullName', 'Full name is required').not().notEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('phoneNumber', 'Please include a valid phone number').isLength({
			min: 10,
			max: 10,
		}),
		check('balance', 'Please enter a balance with 50000 or more').isInt({
			min: 50000,
		}),
		check('service', 'Service is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { position } = req.user
		if (!position || position !== 'EMPLOYEE') {
			return res.status(400).json({
				errors: [{ msg: 'You not have permission to access' }],
			})
		}

		const { fullName, email, phoneNumber, balance, service } = req.body

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

			if (service !== 'VISA' && service !== 'MASTERCARD') {
				return res.status(400).json({
					errors: [
						{
							msg: 'Service does not exist',
						},
					],
				})
			}

			account = new Account({
				account_id: accountId,
				account_type: 'DEFAULT',
				balance,
				account_service: service,
			})

			const responseAccount = await account.save()

			checkErrorsMongoose.createAccountDefault = {
				account_id: responseAccount.account_id,
			}

			const defaultAccountId = responseAccount.account_id

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
				msg: 'Customer successfully created',
				data: {
					login_info: {
						email,
						password,
					},
					card_info: {
						default_account_id: response.default_account_id,
						account_type: responseAccount.account_type,
						account_service: responseAccount.account_service,
						balance: responseAccount.balance,
					},
					personal_info: {
						full_name: response.full_name,
						phone_number: response.phone_number,
					},
				},
			})
		} catch (error) {
			if (checkErrorsMongoose.createAccountDefault !== false) {
				await Account.findOneAndRemove({
					account_id: checkErrorsMongoose.createAccountDefault.account_id,
				})
			}

			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

// @route     GET /customers
// @desc      Lấy thông tin của customer
// @access    Public
router.get('/information', auth, async (req, res) => {
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
			list_receivers_id: listReceiversId,
		} = customer

		let savingAccounts = []
		if (savingAccountsId.length !== 0) {
			savingAccountsId.map(async (e) =>
				savingAccounts.push(await Account.findOne({ account_id: e }))
			)
		}

		const defaultAccount = await Account.findOne({
			account_id: defaultAccountId,
		})

		let listReceivers = []
		// if (listReceiversId.length !== 0) {
		// 	listReceiversId.map(async (e) => {
		// 		listReceivers.push(e)
		// 		// console.log(await Receiver.findById(e))
		// 	})
		// }

		console.log(listReceivers)

		const response = {
			msg: 'Information successfully showed',
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
						account_service: defaultAccount.service,
					},
					saving_accounts: savingAccounts.map((e) => {
						return {
							account_id: e.account_id,
							account_type: e.account_type,
							balance: e.balance,
							account_service: e.service,
						}
					}),
					list_receivers: listReceiversId,
				},
			},
		}

		return res.status(200).json(response)
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     PUT /customers
// @desc      Cập nhật thông tin customer
// @access    Public
router.put('/', async (req, res) => {
	return res.status(200).json({ msg: 'PUT /customers' })
})

module.exports = router
