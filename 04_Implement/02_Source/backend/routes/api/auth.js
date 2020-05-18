const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const User = require('../../models/User')

// @route     GET /auth
// @desc      Lấy thông tin user sau khi đăng nhập thành công (BETA)
// @access    Public
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		res.json(user)
	} catch (error) {
		res.status(500).json({ msg: 'Server error' })
	}
})

// @route     POST /auth
// @desc      Xác thực đăng nhập của user và trả về access-token (BETA)
// @access    Public
router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { email, password } = req.body

		try {
			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Invalid Credentials',
						},
					],
				})
			}

			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Invalid Credentials',
						},
					],
				})
			}

			const payload = {
				user: {
					id: user.id,
				},
			}

			const token = jwt.sign(payload, config.get('jwtSecret'), {
				expiresIn: 3600,
			})
			return res.status(200).json({ 'access-token': token })
		} catch (error) {
			return res.status(500).send('Server error')
		}
	}
)

module.exports = router
