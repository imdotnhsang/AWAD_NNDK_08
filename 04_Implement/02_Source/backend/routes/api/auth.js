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
			expiresIn: 30,
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

// @route     POST /auth/refresh
// @desc      Khi access-token hết hạn chạy api để refresh token tiếp tục sử dụng
// @access    Public
router.post('/refresh', async (req, res) => {
	const refreshToken = req.header('x-auth-refresh-token')
	const accessToken = req.header('x-auth-access-token')

	if (!refreshToken && !accessToken) {
		return res.status(401).json({ msg: 'No token, authorization denied' })
	}

	try {
		jwt.verify(accessToken, config.get('jwtSecret'), { ignoreExpiration: true }, async function (err, payload) {
			const userId = payload.user.id

			const isExist = await RefreshToken.countDocuments({ user_id: userId, refresh_token: refreshToken })

			if (!isExist) {
				return res.status(400).send('Invalid refresh token.')
			}

			const accessToken = jwt.sign({ user: { id: userId } }, config.get('jwtSecret'), {
				expiresIn: 30,
			})

			return res.status(200).json({
				'access-token': accessToken
			})
		})
	} catch (error) {
		return res.status(500).send('Server error')
	}
})

module.exports = router
