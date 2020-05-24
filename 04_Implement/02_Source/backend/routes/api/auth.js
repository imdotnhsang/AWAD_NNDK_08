const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const authCustomer = require('../../middlewares/auth')

const Customer = require('../../models/Customer')
const RefreshToken = require('../../models/RefreshToken')

// @route     GET /auth/customers
// @desc      Lấy thông tin customer sau khi đăng nhập thành công
// @access    Public
router.get('/customers', authCustomer, async (req, res) => {
	try {
		const customer = await Customer.findById(req.user.id)
		res.json(customer)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Server error' })
	}
})

// @route     POST /auth/customers
// @desc      Xác thực đăng nhập của customer và trả về access-token
// @access    Public
router.post('/customers', [
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
		const customer = await Customer.findOne({ email })

		if (!customer) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Email not exists',
					},
				],
			})
		}

		const isMatch = await bcrypt.compare(password, customer.password)

		if (!isMatch) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Password is incorrect',
					},
				],
			})
		}

		if (!customer.is_active) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Account is not active',
					},
				],
			})
		}

		const payload = {
			user: {
				id: customer.id,
			},
		}

		const accessToken = jwt.sign(payload, config.get('jwtSecret'), {
			expiresIn: config.get('jwtAccessExpiration'),
		})

		const RFSZ = 80
		const refreshToken = {
			user_id: payload.user.id,
			entry_time: Date.now(),
			refresh_token: randToken.generate(RFSZ)
		}

		RefreshToken.findOne({ user_id: refreshToken.user_id }, async (err, user) =>
			user ? await RefreshToken.findOneAndUpdate({ user_id: refreshToken.user_id }, refreshToken) : await new RefreshToken(refreshToken).save()
		)

		return res.status(200).json({
			'access-token': accessToken,
			'refresh-token': refreshToken.refresh_token
		})
	} catch (error) {
		return res.status(500).send('Server error')
	}
})

module.exports = router
