const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')

const auth = require('../../middlewares/auth')
const administrator = require('../../middlewares/administrator')

const Transaction = require('../../models/Transaction')
const Staff = require('../../models/Staff')

// @route     GET /administrators/all-staffs
// @desc      Get all information administrator page
// @access    Private (administrator)
router.get('/all-staffs', [auth, administrator], async (req, res) => {
	try {
		const allStaffs = await Staff.find({}, { _id: 0, __v: 0 })

		const response = {
			msg: 'All staffs successfully got.',
			data: allStaffs,
		}
		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error...' })
	}
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
					errors: [{ msg: 'Position register does not exist.' }],
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

			const responseStaff = await staff.save()

			let response = {}
			if (positionRegister === 'EMPLOYEE') {
				response = {
					msg: 'Employee successfully created.',
					data: {
						login_info: {
							username,
							password,
						},
						personal_info: {
							full_name: responseStaff.full_name,
							phone_number: responseStaff.phone_number,
							email: responseStaff.email,
							position: responseStaff.position,
							created_at: responseStaff.created_at,
						},
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

			if (!email && !fullName) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Full name or email is required.',
						},
					],
				})
			}

			const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/gm
			if (email && re.test(String(email)) === false) {
				return res.status(400).json({
					errors: [{ msg: 'Please include a valid email.' }],
				})
			}

			const newEmail = email || staff.email
			const newFullname = fullName || staff.full_name

			if (newEmail === staff.email && newFullname === staff.full_name) {
				return res.status(400).json({
					errors: [
						{
							msg: 'New information cannot coincide with old information.',
						},
					],
				})
			}

			const isExist = email && (await Staff.countDocuments({ email }))
			if (isExist) {
				return res.status(400).json({
					errors: [
						{
							msg: 'New email already exists.',
						},
					],
				})
			}

			staff.full_name = newFullname
			staff.email = newEmail
			// staff.username = email.split('@')[0].toLowerCase()
			await staff.save()

			const response = { msg: 'Staff successfully updated.' }
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
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
			const allInterbankTransactions = await Transaction.find(
				{
					$or: [
						{
							transaction_type: 'TRANSFER',
							to_bank_id: { $ne: 'EIGHT' },
							from_bank_id: 'EIGHT',
						},
						{
							transaction_type: 'RECEIVE',
							to_bank_id: 'EIGHT',
							from_bank_id: { $ne: 'EIGHT' },
						},
					],
				},
				{ _id: 0, __v: 0 }
			)

			const response = {
				msg: 'All interbank transactions successfully got.',
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
