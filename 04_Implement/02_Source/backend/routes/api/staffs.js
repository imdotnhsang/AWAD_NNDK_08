const express = require('express')

const router = express.Router()
const auth = require('../../middlewares/auth')

const Staff = require('../../models/Staff')

// @route     GET /staffs
// @desc      Lấy thông tin của một staff đang đăng nhập
// @access    Private (administrator & employee)
router.get('/information', auth, async (req, res) => {
	try {
		const { position } = req.user
		if (!position) {
			return res.status(403).json({
				errors: [{ msg: 'You not have permission to access' }],
			})
		}

		const staff = await Staff.findById(req.user.id)
		if (!staff) {
			return res.status(400).json({
				errors: [{ msg: 'Staff not exists' }],
			})
		}

		const response = {
			msg: 'Information successfully got',
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
// @access    Private (administrator & employee)
router.put('/update', async (req, res) => {
	return res.status(200).json({ msg: 'PUT /staffs' })
})

module.exports = router
