const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Transaction = require('../../models/Transaction')
const Staff = require('../../models/Staff')

// @route     POST /administrator/register-staff
// @desc      Tạo staff (employee hoặc admin) mới
// @access    Private (administrator)
router.post(
	'/register-staff',
	[
		auth,
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

		const { position } = req.user
		if (!position || position !== 'ADMINISTRATOR') {
			return res.status(403).json({
				errors: [{ msg: 'You not have permission to access' }],
			})
		}

		const { fullName, email, phoneNumber, positionRegister } = req.body

		const username = email.split('@')[0].toLowerCase()

		try {
			const isExist = await Staff.countDocuments({
				$or: [{ email }, { phone_number: phoneNumber }],
			})
			if (isExist) {
				return res.status(400).json({
					errors: [{ msg: 'Email or phone number already exists' }],
				})
			}

			if (
				positionRegister !== 'EMPLOYEE' &&
				positionRegister !== 'ADMINISTRATOR'
			) {
				return res.status(400).json({
					errors: [{ msg: 'Position Register does not exist' }],
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
			})

			const salt = await bcrypt.genSalt(10)
			staff.password = await bcrypt.hash(password, salt)

			await staff.save()

			let response = {}
			if (positionRegister === 'EMPLOYEE') {
				response = {
					msg: 'Employee successfully created',
					data: {
						username,
						password,
					},
				}
			} else if (positionRegister === 'ADMINISTRATOR') {
				response = {
					msg: 'Administrator successfully created',
					data: {
						username,
						password,
					},
				}
			}
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error' })
		}
	}
)

// @route     GET /administrators/all-staffs
// @desc      Lấy danh sách tất cả các tài khoản staff
// @access    Private (administrator)
router.get('/all-staffs', auth, async (req, res) => {
	const { position } = req.user

	if (!position || position !== 'ADMINISTRATOR') {
		return res.status(403).json({
			errors: [{ msg: 'You not have permission to access' }],
		})
	}

	try {
		const allStaffs = (await Staff.find()).map((e) => {
			return {
				full_name: e.full_name,
				username: e.username,
				email: e.email,
				phone_number: e.phone_number,
				position: e.position,
				is_active: e.is_active,
				create_at: e.create_at,
			}
		})

		return res
			.status(200)
			.json({ msg: 'All staffs successfully got', data: allStaffs })
	} catch (error) {
		return res.status(500).json({ msg: 'Server Error' })
	}
})

// @route     PUT /administrator
// @desc      Cập nhật thông tin staff một staff bất kì
// @access    Private (administrator)
router.put('/update-staff', auth, async (req, res) => {
	const { position } = req.user
	if (!position || position !== 'ADMINISTRATOR') {
		return res.status(403).json({
			errors: [{ msg: 'You not have permission to access' }],
		})
	}

	try {
		return res.status(200).json({ msg: 'PUT /administrators/update-staff' })
	} catch (error) {
		return res.status(400).json({ msg: 'Server error' })
	}
})

// @route     PUT /administrators/deactivate-staff
// @desc      Xoá một staff bất kì
// @access    Private (administrator)
router.put(
	'/deactivate-staff',
	[auth, check('username', 'Username is required').not().notEmpty()],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { position } = req.user
		if (!position || position !== 'ADMINISTRATOR') {
			return res.status(403).json({
				errors: [{ msg: 'You not have permission to access' }],
			})
		}

		const { username } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists',
						},
					],
				})
			}

			if (!staff.is_active) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff was deactivated',
						},
					],
				})
			}

			staff.is_active = false
			await staff.save()

			return res.status(200).json({ msg: 'Staff successfully deactivate' })
		} catch (error) {
			return res.status(400).json({ msg: 'Server error' })
		}
	}
)

// @route     PUT /administrators/activate-staff
// @desc      Xoá một staff bất kì
// @access    Private (administrator)
router.put(
	'/activate-staff',
	[auth, check('username', 'Username is required').not().notEmpty()],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { position } = req.user
		if (!position || position !== 'ADMINISTRATOR') {
			return res.status(403).json({
				errors: [{ msg: 'You not have permission to access' }],
			})
		}

		const { username } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists',
						},
					],
				})
			}

			if (staff.is_active) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff was activated',
						},
					],
				})
			}

			staff.is_active = true
			await staff.save()

			return res.status(200).json({ msg: 'Staff successfully activate' })
		} catch (error) {
			return res.status(400).json({ msg: 'Server error' })
		}
	}
)

// @route     GET /administrators/all-interbank-transactions
// @desc      Lấy toàn bộ danh sách giao dịch
// @access    Private (administrator)
router.get('/all-interbank-transactions', auth, async (req, res) => {
	const { position } = req.user
	if (!position || position !== 'ADMINISTRATOR') {
		return res.status(403).json({
			errors: [{ msg: 'You not have permission to access' }],
		})
	}

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

		return res.status(200).json({
			msg: 'All transactions successfully got',
			data: allInterbankTransactions,
		})
	} catch (error) {
		return res.status(400).json({
			msg: 'Server error',
		})
	}
})

module.exports = router
