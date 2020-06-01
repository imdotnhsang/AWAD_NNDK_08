const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const auth = require('../../middlewares/auth')

const Customer = require('../../models/Customer')
const Account = require('../../models/Account')
const Receiver = require('../../models/Receiver')

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

		const savingAccounts = (
			await Account.find({
				account_id: {
					$in: savingAccountsId.map((e) => e),
				},
			})
		).map((e) => {
			return {
				account_id: e.account_id,
				account_type: e.account_type,
				balance: e.balance,
				account_service: e.account_service,
			}
		})

		const defaultAccount = await Account.findOne({
			account_id: defaultAccountId,
		})

		const listReceivers = (
			await Receiver.find({
				_id: {
					$in: listReceiversId.map((e) => mongoose.Types.ObjectId(e)),
				},
			})
		).map((e) => {
			return {
				bank_name: e.bank_name,
				account_id: e.account_id,
				nickname: e.nickname,
			}
		})

		const response = {
			msg: 'Information successfully got',
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
						account_service: defaultAccount.account_service,
					},
					saving_accounts: savingAccounts,
					list_receivers: listReceivers,
				},
			},
		}

		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     PUT /customers
// @desc      Cập nhật thông tin customer
// @access    Public
router.put('/', async (req, res) => {
	return res.status(200).json({ msg: 'PUT /customers' })
})

// @route     PUT /customers/all-customers
// @desc      Lấy tất cả các customer
// @access    Public
router.get('/all-customers', auth, async (req, res) => {
	const { position } = req.user

	if (!position || position !== 'EMPLOYEE') {
		return res.status(403).json({
			errors: [{ msg: 'You not have permission to access' }],
		})
	}

	try {
		const allCustomers = (await Customer.find()).map((e) => {
			return {
				full_name: e.full_name,
				default_account_id: e.default_account_id,
				email: e.email,
				phone_number: e.phone_number,
			}
		})

		return res
			.status(200)
			.json({ msg: 'All customers successfully got', data: allCustomers })
	} catch (error) {
		return res.status(500).json({ msg: 'Server Error' })
	}
})

module.exports = router
