const express = require('express')

const router = express.Router()
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
		check('newPassword', 'Please include a valid password').isLength({
			min: 8,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username, newPassword } = req.body

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

			const response = { msg: 'Password successfully reset.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

module.exports = router
