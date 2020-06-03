const express = require('express')

const router = express.Router()
// const bcrypt = require('bcrypt')
// const { check, validationResult } = require('express-validator')

// const auth = require('../../middlewares/auth')
// const staff = require('../../middlewares/staff')

// const Staff = require('../../models/Staff')

// @route     GET /staffs/information
// @desc      Get information staff
// @access    Private (administrator & employee)
// router.get('/information', [auth, staff], async (req, res) => {
// 	try {
// 		const staff = await Staff.findById(req.user.id)
// 		if (!staff) {
// 			return res.status(400).json({
// 				errors: [{ msg: 'Staff not exists' }],
// 			})
// 		}

// 		const response = {
// 			msg: 'Information successfully got',
// 			data: {
// 				username: staff.username,
// 				full_name: staff.full_name,
// 				phone_number: staff.full_name,
// 				email: staff.email,
// 				position: staff.position,
// 			},
// 		}
// 		return res.status(200).json(response)
// 	} catch (error) {
// 		return res.status(500).json({ msg: 'Server error' })
// 	}
// })

// @route     PUT /staffs/change-password
// @desc      Change password staff
// @access    Private (administrator & employee)
// router.put(
// 	'/change-password',
// 	[
// 		auth,
// 		staff,
// 		check('oldPassword', 'Please include a valid password').isLength({
// 			min: 8,
// 		}),
// 		check('newPassword', 'Please include a valid password').isLength({
// 			min: 8,
// 		}),
// 	],
// 	async (req, res) => {
// 		const errors = validationResult(req)
// 		if (!errors.isEmpty()) {
// 			return res.status(400).send(errors)
// 		}

// 		const { oldPassword, newPassword } = req.body

// 		try {
// 			if (newPassword === oldPassword) {
// 				return res.status(400).json({
// 					errors: [{ msg: 'New password cannot coincide with old password' }],
// 				})
// 			}

// 			const staff = await Staff.findById(req.user.id)
// 			if (!staff) {
// 				return res.status(400).json({
// 					errors: [{ msg: 'Staff not exists' }],
// 				})
// 			}

// 			const isMatch = await bcrypt.compare(oldPassword, staff.password)
// 			if (!isMatch) {
// 				return res.status(400).json({
// 					errors: [
// 						{
// 							msg: 'Old password is incorrect',
// 						},
// 					],
// 				})
// 			}

// 			const salt = await bcrypt.genSalt(10)
// 			staff.password = await bcrypt.hash(newPassword, salt)

// 			await staff.save()

// 			return res.status(200).json({ msg: 'Password successfully changed' })
// 		} catch (error) {
// 			return res.status(500).json({ msg: 'Server error' })
// 		}
// 	}
// )

module.exports = router
