const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')

const auth = require('../../middlewares/auth')
const employee = require('../../middlewares/employee')

const Customer = require('../../models/Customer')
const Account = require('../../models/Account')
const Transaction = require('../../models/Transaction')
const CustomerAction = require('../../action/customer')
const { MakeResponse, APIStatus } = require('../../utils/APIStatus.js')
const { GetQuery } = require('../../utils/GetQuery.js')
const DBModel = require('../../utils/DBModel.js')
const { sendOTPCode } = require('../../utils/OTP/sendOTP.js')

const DBModelInstance = new DBModel()

// @route     GET /employees/all-customers
// @desc      Get all information of employee page
// @access    Private (employee)
router.get('/all-customers', [auth, employee], async (req, res) => {
	try {
		const offset = GetQuery('offset', req)
		const limit = GetQuery('limit', req)
		const reverse = GetQuery('reverse', req)
		const getTotal = GetQuery('getTotal', req)
		const search = GetQuery('search',req)

		let result = []
		if (search && search != '') {
			result = await CustomerAction.getCustomer(
				{
					$or: [
						{email:new RegExp(search, "i")},
						{default_account_id:new RegExp(search, "i")}
					]
				},
				null,
				offset,
				limit,
				reverse,
				getTotal
			)
		} else {
			result = await CustomerAction.getCustomer(
				{},
				null,
				offset,
				limit,
				reverse,
				getTotal
			)
		}
		return MakeResponse(req, res, result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'Server error...' })
	}
})

// @route     GET /employees/customer/detail
// @desc      Get account detail
// @access    Private (employee)
router.get('/customer-detail', [auth,employee], async (req,res) => {
	try {
		const email = GetQuery('email',req)
		if (!email || email == '') {
			return MakeResponse(req,res,{
				status:APIStatus.Invalid,
				message: 'Require email'
			})
		}

		let customerResult = await CustomerAction.getCustomer({email,is_active:true},null,0,1,false,false)
		if (customerResult.status != APIStatus.Ok) {
			return MakeResponse(req,res,{
				status: APIStatus.NotFound,
				message: 'Not found any match customer'
			})
		}

		let accountResult = await DBModelInstance.Query(Account, {account_id:customerResult.data[0].default_account_id},null,0,1,false)
		if (accountResult.status != APIStatus.Ok) {
			return MakeResponse(req,res,accountResult)
		}

		return MakeResponse(req,res,{
			status: APIStatus.Ok,
			message: 'Get customer detail successfully',
			data: [
				{
					email:  customerResult.data[0].email,
					full_name: customerResult.data[0].full_name,
					phone_number: customerResult.data[0].phone_number,
					default_account_id: customerResult.data[0].default_account_id,
					balance: accountResult.data[0].balance,
					created_at: customerResult.data[0].created_at
				}
			]
		})

	} catch (error) {
		console.log(error)
		return res.status(500).json({message: 'Server error...'})
	}
})

// @route     POST /employees/register-customer
// @desc      Create customer account
// @access    Private (employee)
router.post(
	'/register-customer',
	[
		auth,
		employee,
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

		const service = Date.now() % 2 === 1 ? 'MASTERCARD' : 'VISA'

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
							msg: 'Email or phone number already exists.',
						},
					],
				})
			}

			const nanoidAccountId = customAlphabet('1234567890', 14)
			const accountId = nanoidAccountId()

			const account = new Account({
				account_id: accountId,
				account_type: 'DEFAULT',
				balance,
				account_service: service,
				created_at: Date.now(),
			})

			const responseAccount = await account.save()

			checkErrorsMongoose.createAccountDefault = {
				account_id: responseAccount.account_id,
			}

			const { account_id: defaultAccountId } = responseAccount

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
				is_active: true,
				created_at: Date.now(),
			})

			const salt = await bcrypt.genSalt(10)
			customer.password = await bcrypt.hash(password, salt)

			await sendOTPCode(customer.email, customer.full_name, customer.password, 'forgotPassword')

			const responseCustomer = await customer.save()

			const response = {
				msg: 'Customer successfully created.',
				data: {
					login_info: {
						email,
						password,
					},
					card_info: {
						default_account_id: responseCustomer.default_account_id,
						account_type: responseAccount.account_type,
						account_service: responseAccount.account_service,
						balance: responseAccount.balance,
					},
					personal_info: {
						full_name: responseCustomer.full_name,
						phone_number: responseCustomer.phone_number,
						created_at: responseCustomer.created_at,
					},
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.createAccountDefault !== false) {
				await Account.findOneAndRemove({
					account_id: checkErrorsMongoose.createAccountDefault.account_id,
				})
			}

			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     POST /employees/recharge-customer
// @desc      Recharge customer
// @access    Private (employee)
router.post(
	'/recharge-customer',
	[
		auth,
		employee,
		check('rechargeAmount', 'Recharge amount is 50000 or more').isInt({
			min: 50000,
		}),
		check('rechargeAccountId', 'Recharge account id is required'),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { rechargeAccountId, rechargeAmount } = req.body

		if (rechargeAccountId.length !== 14) {
			return res.status(400).json({
				errors: [{ msg: 'Please include a valid recharge account id.' }],
			})
		}

		const checkErrorsMongoose = {
			createTransactionReceiver: false,
		}

		try {
			const customer = await Customer.findOne({
				default_account_id: rechargeAccountId,
			})

			if (!customer) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Customer does not exist.' }] })
			}

			const account = await Account.findOne({
				account_id: customer.default_account_id,
			})

			if (!account || account.account_type !== 'DEFAULT') {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Account does not exist.' }] })
			}

			const transactionReceiver = {
				entry_time: Date.now(),
				from_account_id: '************08',
				from_fullname: 'Eight Bank',
				to_account_id: customer.default_account_id,
				to_fullname: customer.full_name,
				from_bank_id: 'EIGHT.Bank',
				to_bank_id: 'EIGHT.Bank',
				transaction_type: 'RECHARGE',
				transaction_amount: rechargeAmount,
				transaction_balance_before: account.balance,
				transaction_balance_after:
					Number(account.balance) + Number(rechargeAmount),
				transaction_status: 'FAILED',
			}

			checkErrorsMongoose.createTransactionReceiver = transactionReceiver

			await account.updateOne({
				$inc: {
					balance: rechargeAmount,
				},
			})

			transactionReceiver.transaction_balance_after =
				Number(account.balance) + Number(rechargeAmount)
			transactionReceiver.transaction_status = 'SUCCESS'
			const reponseTransaction = await new Transaction(
				transactionReceiver
			).save()

			const response = {
				msg: 'Account successfully recharged.',
				data: {
					full_name: reponseTransaction.to_fullname,
					account_id: reponseTransaction.to_account_id,
					balance_before: reponseTransaction.transaction_balance_before,
					balance_after: reponseTransaction.transaction_balance_after,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.createTransactionReceiver !== false) {
				await new Transaction(
					checkErrorsMongoose.createTransactionReceiver
				).save()
			}

			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     GET /employees/transaction-history
// @desc      View transaction history of any customer account
// @access    Private (employee)
router.get(
	'/transaction-history/:type_transaction_history',
	[
		auth,
		employee,
		check('historyAccountId', 'Account id is required').not().notEmpty(),
	],
	async (req, res) => {
		try {
			const { historyAccountId } = req.query
			const offset = GetQuery('offset', req)
			const limit = GetQuery('limit', req)
			const reverse = GetQuery('reverse', req)
			const getTotal = GetQuery('getTotal', req)

			if (historyAccountId.length !== 14) {
				return res.status(400).json({
					errors: [{ msg: 'Please include a valid account id.' }],
				})
			}

			const customer = await Customer.findOne({
				default_account_id: historyAccountId,
			})
			if (!customer) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Customer does not exist.' }] })
			}

			const { default_account_id: defaultAccountId } = customer
			const { type_transaction_history } = req.params

			let condition = {}
			let project = {}

			switch (type_transaction_history) {
			case 'receive':
				condition = {
					$or: [
						{
							to_account_id: defaultAccountId,
							transaction_type: 'RECEIVE',
						},
						{
							to_account_id: defaultAccountId,
							transaction_type: 'RECHARGE',
						},
					],
				}
				project = { __v: 0 }
				break
			case 'transfer':
				condition = {
					from_account_id: defaultAccountId,
					transaction_type: 'TRANSFER',
				}
				project = { __v: 0 }
				break
			case 'debt-paying':
				(condition = {
					$or: [
						{
							from_account_id: defaultAccountId,
							transaction_type: 'REPAYMENT',
						},
						{
							to_account_id: defaultAccountId,
							transaction_type: 'REPAYMENT',
						},
					],
				}),
				(project = { __v: 0 })
				break
			default:
				break
			}

			//const data = await Transaction.find(condition, project)
			let result = await DBModelInstance.Query(Transaction,condition,project,offset,limit,reverse)
			if (result.status != APIStatus.Ok) {
				return MakeResponse(req,res,result)
			}
			if (getTotal) {
				let count = await DBModelInstance.Count(Transaction,condition)
				result.total = count.total
			}
			// const response = {
			// 	msg: 'All transactions successfully got.',
			// 	data,
			// }
			// return res.status(200).json(response)
			return MakeResponse(req,res,result)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

module.exports = router
