const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const randToken = require('rand-token')
const redis = require('redis')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const authCustomer = require('../../middlewares/auth')

const Customer = require('../../models/Customer')

const redisClient = require('../../config/redis')

// @route     GET /auth/customers
// @desc      Lấy thông tin customer sau khi đăng nhập thành công
// @access    Public
router.get('/customers', authCustomer, async (req, res) => {
	try {
		console.log(req.cookies)
		const customer = await Customer.findById(req.user.id)

		// redisClient.get('5ec5b7cc48283c9b5a6ceb7b', redis.print)

		res.json(customer)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Server error' })
	}
})

// @route     POST /auth/customers
// @desc      Xác thực đăng nhập của customer và trả về access-token
// @access    Public
router.post('/customers/login', [
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

		const payload = {
			user: {
				id: customer.id,
			},
		}

		const accessToken = jwt.sign(payload, config.get('jwtSecret'), {
			expiresIn: config.get('jwtAccessExpiration')
		})

		const RFSZ = 80
		const refreshTokenInfo = {
			user_id: payload.user.id,
			expired_at: Date.now() + config.get('jwtRefreshExpiration'),
			refresh_token: randToken.generate(RFSZ)
		}

		res.cookie('access_token', accessToken, {
			secure: false,
			httpOnly: true
		})

		res.cookie('refresh_token', refreshTokenInfo.refresh_token, {
			secure: false,
			httpOnly: true
		})
		// res.clearCookie('_access_token')
		// res.clearCookie('access-token')
		// res.clearCookie('refresh-token')

		redisClient.set(refreshTokenInfo.user_id, JSON.stringify({
			refresh_token: refreshTokenInfo.refresh_token,
			expired_at: refreshTokenInfo.expired_at
		}), redis.print)

		return res.status(200).json({
			'access-token': accessToken,
			'refresh-token': refreshTokenInfo.refresh_token
		})
	} catch (error) {
		return res.status(500).send('Server error')
	}
})


router.post('/logout', authCustomer, async (req, res) => {
	try {
		redisClient.del(req.user.id)

		res.clearCookie('access_token')
		res.clearCookie('refresh_token')
		// res.redirect('/')

		return res.status(200).json({ msg: 'Log out successfully!!!' })
	} catch (error) {
		return res.status(500).send('Server error')
	}
})
module.exports = router
