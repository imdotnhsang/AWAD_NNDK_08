const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const Customer = require('../../models/Customer')
const Staff = require('../../models/Staff')
const redisClient = require('../../config/redis')

// @route     GET /auth/users
// @desc      Test truyền payload vào req
// @access    Public
router.get('/users', auth, async (req, res) => {
	try {
		return res.status(200).json(req.user)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error...' })
	}
})

// @route     POST /auth/customers/login
// @desc      Auth customer and return access-token
// @access    Public
router.post(
	'/customers/login',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').not().notEmpty(),
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
							msg: 'Email not exists.',
						},
					],
				})
			}

			const isMatch = await bcrypt.compare(password, customer.password)
			if (!isMatch) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Password is incorrect.',
						},
					],
				})
			}

			if (customer.is_active !== true) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Customer is deactivated.',
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
			const refreshTokenInfo = {
				user_id: payload.user.id,
				expired_at: Date.now() + config.get('jwtRefreshExpiration'),
				refresh_token: randToken.generate(RFSZ),
			}

			res.cookie('access_token', accessToken, {
				secure: false,
				httpOnly: true,
			})

			res.cookie('refresh_token', refreshTokenInfo.refresh_token, {
				secure: false,
				httpOnly: true,
			})

			// res.clearCookie('_access_token')
			// res.clearCookie('access-token')
			// res.clearCookie('refresh-token')

			redisClient.set(
				refreshTokenInfo.user_id,
				JSON.stringify({
					refresh_token: refreshTokenInfo.refresh_token,
					expired_at: refreshTokenInfo.expired_at,
				})
			)

			return res.status(200).json({
				msg: 'Signed in successfully.',
				data: {
					'access-token': accessToken,
					'refresh-token': refreshTokenInfo.refresh_token,
					account_id: customer.default_account_id,
					full_name: customer.full_name,
				},
			})
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     POST /auth/staff/login
// @desc      Auth staff (employee vs admin) and return access-token
// @access    Public
router.post(
	'/staffs/login',
	[
		check('username', 'Username is required').not().notEmpty(),
		check('password', 'Password is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username, password } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Username does not exist.',
						},
					],
				})
			}

			const isMatch = await bcrypt.compare(password, staff.password)
			if (!isMatch) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Password is incorrect.',
						},
					],
				})
			}

			if (staff.is_active !== true) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff is deactivated.',
						},
					],
				})
			}

			const payload = {
				user: {
					id: staff.id,
					position: staff.position,
				},
			}

			const accessToken = jwt.sign(payload, config.get('jwtSecret'), {
				expiresIn: config.get('jwtAccessExpiration'),
			})

			const RFSZ = 80
			const refreshTokenInfo = {
				user_id: payload.user.id,
				expired_at: Date.now() + config.get('jwtRefreshExpiration'),
				refresh_token: randToken.generate(RFSZ),
			}

			res.cookie('access_token', accessToken, {
				secure: false,
				httpOnly: true,
			})

			res.cookie('refresh_token', refreshTokenInfo.refresh_token, {
				secure: false,
				httpOnly: true,
			})

			redisClient.set(
				refreshTokenInfo.user_id,
				JSON.stringify({
					refresh_token: refreshTokenInfo.refresh_token,
					expired_at: refreshTokenInfo.expired_at,
				})
			)

			const response = {
				msg: 'Signed in successfully.',
				data: {
					'access-token': accessToken,
					'refresh-token': refreshTokenInfo.refresh_token,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

router.post('/logout', auth, async (req, res) => {
	try {
		redisClient.del(req.user.id)

		res.clearCookie('access_token')
		res.clearCookie('refresh_token')
		// res.redirect('/')

		const response = { msg: 'Logged out successfully.' }
		return res.status(200).json(response)
	} catch (error) {
		return res.status(500).json({ msg: 'Server error...' })
	}
})

module.exports = router
