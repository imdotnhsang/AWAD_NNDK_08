const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Staff = require('../../models/Staff')

// @route     POST /staff
// @desc      Tạo staff (employee hoặc admin) mới
// @access    Public
router.post(
	'/register',
	[
		check('fullName', 'Full name is required').not().notEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('phoneNumber', 'Please include a valid phone number').isLength({
			min: 10,
			max: 10,
		}),
		check('position', 'Please choose a position').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { fullName, email, phoneNumber, position } = req.body

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

			if (position !== 'EMPLOYEE' && position !== 'ADMINISTRATOR') {
				return res.status(400).json({
					errors: [{ msg: 'Position does not exist' }],
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
				position,
				created_at: Date.now(),
			})

			const salt = await bcrypt.genSalt(10)
			staff.password = await bcrypt.hash(password, salt)

			await staff.save()

			let response = {}
			if (position === 'EMPLOYEE') {
				response = {
					msg: 'Employee successfully created',
					data: {
						username,
						password,
					},
				}
			} else if (position === 'ADMINISTRATOR') {
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

// @route     GET /staffs
// @desc      Lấy thông tin của staff
// @access    Public
router.get('/information', auth, async (req, res) => {
	try {
		const staff = await Staff.findById(req.user.id)

		if (!staff) {
			return res.status(400).json({
				errors: [{ msg: 'Staff not exists' }],
			})
		}

		const response = {
			msg: 'Information successfully showed',
			data: {
				username: staff.username,
				full_name: staff.full_name,
				phone_number: staff.full_name,
				email: staff.email,
				position: staff.position,
			},
		}
		return res.status(200).json(response)
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     PUT /staffs
// @desc      Cập nhật thông tin staff
// @access    Public
router.put('/', async (req, res) => {
	return res.status(200).json({ msg: 'PUT /staffs' })
})

module.exports = router
