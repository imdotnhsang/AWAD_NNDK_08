const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')

const auth = require('../../middlewares/auth')
const administrator = require('../../middlewares/administrator')

const Transaction = require('../../models/Transaction')
const Staff = require('../../models/Staff')

// @route     GET /administrators/init-page
// @desc      Get all information administrator page
// @access    Private (administrator)
router.get('/init-page', [auth, administrator], async (req, res) => {
	Promise.all([
		Staff.find(),
		Transaction.find(
			{
				$or: [
					{
						$and: [
							{
								transaction_type: 'RECEIVE',
							},
							{
								from_bank_id: 'EIGHT',
							},
						],
					},
					{
						$and: [
							{
								transaction_type: 'TRANSFER',
							},
							{
								to_bank_id: 'EIGHT',
							},
						],
					},
				],
			},
			{ _id: 0, __v: 0 }
		),
	])
		.then(([allStaffs, allInterbankTransactions]) => {
			const response = {
				msg: 'Information page successfully initialized.',
				data: {
					all_staffs: allStaffs,
					all_interbank_transactions: allInterbankTransactions,
				},
			}
			return res.status(200).json(response)
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		})
})

// @route     POST /administrator/register-staff
// @desc      Create new staff (employee or administrator)
// @access    Private (administrator)
router.post(
	'/register-staff',
	[
		auth,
		administrator,
		check('fullName', 'Full name is required').not().notEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('phoneNumber', 'Please include a valid phone number').isLength({
			min: 10,
			max: 10,
		}),
		check('positionRegister', 'Please choose a position').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { fullName, email, phoneNumber, positionRegister } = req.body

		const username = email.split('@')[0].toLowerCase()

		try {
			const isExist = await Staff.countDocuments({
				$or: [{ email }, { phone_number: phoneNumber }],
			})
			if (isExist) {
				return res.status(400).json({
					errors: [{ msg: 'Email or phone number already exists.' }],
				})
			}

			if (
				positionRegister !== 'EMPLOYEE' &&
				positionRegister !== 'ADMINISTRATOR'
			) {
				return res.status(400).json({
					errors: [{ msg: 'Position Register does not exist.' }],
				})
			}

			const nanoidPassword = customAlphabet(
				'1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
				8
			)
			const password = nanoidPassword()

			const staff = new Staff({
				username,
				email: email.toLowerCase(),
				phone_number: phoneNumber,
				password,
				full_name: fullName,
				position: positionRegister,
				created_at: Date.now(),
				is_active: true,
			})

			const salt = await bcrypt.genSalt(10)
			staff.password = await bcrypt.hash(password, salt)

			await staff.save()

			let response = {}
			if (positionRegister === 'EMPLOYEE') {
				response = {
					msg: 'Employee successfully created.',
					data: {
						username,
						password,
					},
				}
			} else if (positionRegister === 'ADMINISTRATOR') {
				response = {
					msg: 'Administrator successfully created.',
					data: {
						username,
						password,
					},
				}
			}
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /administrators/update-staff
// @desc      Update information staff (full name, email => username)
// @access    Private (administrator)
router.put(
	'/update-staff',
	[
		auth,
		administrator,
		check('username', 'Username is required').not().notEmpty(),
		check('fullName', 'Full name is required').not().notEmpty(),
		check('email', 'Please include a valid email').isEmail(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username, fullName, email } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists.',
						},
					],
				})
			}

			if (email === staff.email && fullName === staff.full_name) {
				return res.status(400).json({
					errors: [
						{
							msg: 'New information cannot coincide with old information.',
						},
					],
				})
			}

			const isExist = await Staff.countDocuments({ email })
			if (isExist && email !== staff.email) {
				return res.status(400).json({
					errors: [
						{
							msg: 'New email already exists.',
						},
					],
				})
			}

			staff.full_name = fullName
			staff.email = email
			staff.username = email.split('@')[0].toLowerCase()
			await staff.save()

			const response = { msg: 'Staff successfully updated.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /administrators/deactivate-staff
// @desc      Deactivate any staff
// @access    Private (administrator)
router.put(
	'/deactivate-staff',
	[
		auth,
		administrator,
		check('username', 'Username is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists.',
						},
					],
				})
			}

			if (!staff.is_active) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff was deactivated.',
						},
					],
				})
			}

			staff.is_active = false
			await staff.save()

			const response = { msg: 'Staff successfully deactivated.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /administrators/activate-staff
// @desc      Active any staff which was deactivated
// @access    Private (administrator)
router.put(
	'/activate-staff',
	[
		auth,
		administrator,
		check('username', 'Username is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists.',
						},
					],
				})
			}

			if (staff.is_active) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff was activated.',
						},
					],
				})
			}

			staff.is_active = true
			await staff.save()

			const response = { msg: 'Staff successfully activated.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     GET /administrators/all-interbank-transactions
// @desc      Get all interbank transactions
// @access    Private (administrator)
router.get(
	'/all-interbank-transactions',
	[auth, administrator],
	async (req, res) => {
		try {
			const allInterbankTransactions = (await Transaction.find())
				.filter(
					(e) =>
						(e.transaction_type === 'RECEIVE' && e.from_bank_id !== 'EIGHT') ||
						(e.transaction_type === 'TRANSFER' && e.to_bank_id !== 'EIGHT')
				)
				.map((e) => {
					return {
						entry_time: e.entry_time,
						from_bank_id: e.from_bank_id,
						to_bank_id: e.to_bank_id,
						from_account_id: e.from_account_id,
						from_fullname: e.from_fullname,
						to_account_id: e.to_account_id,
						to_fullname: e.to_fullname,
						transaction_type: e.transaction_type,
						transaction_amount: e.transaction_amount,
						transaction_status: e.transaction_status,
					}
				})

			const response = {
				msg: 'All transactions successfully got.',
				data: allInterbankTransactions,
			}
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({
				msg: 'Server error...',
			})
		}
	}
)

module.exports = router
