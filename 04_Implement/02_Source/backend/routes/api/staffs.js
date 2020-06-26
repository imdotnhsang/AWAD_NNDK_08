const express = require('express')

const router = express.Router()
const { customAlphabet } = require('nanoid')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')

const auth = require('../../middlewares/auth')
const administrator = require('../../middlewares/administrator')

const Staff = require('../../models/Staff')

// @route     PUT /staffs/reset-password
// @desc      Reset password staff
// @access    Private (administrator)
router.put(
	'/reset-password',
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

		const nanoidPassword = customAlphabet(
			'1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
			8
		)
		const newPassword = nanoidPassword()

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [{ msg: 'Staff not exists.' }],
				})
			}

			const salt = await bcrypt.genSalt(10)
			staff.password = await bcrypt.hash(newPassword, salt)

			await staff.save()

			const response = {
				msg: 'Password successfully reset.',
				data: { username, password: newPassword },
			}
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

module.exports = router
