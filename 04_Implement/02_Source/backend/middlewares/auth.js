const jwt = require('jsonwebtoken')
const config = require('config')
const redis = require('redis')
const bluebird = require('bluebird')

const redisClient = require('../config/redis')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = async (req, res, next) => {
	// Get token from Header
	const accessToken = req.cookies.access_token || null
	const refreshToken = req.cookies.refresh_token || null

	// Check if not token
	if (!accessToken || !refreshToken) {
		return res.status(401).json({ msg: 'No access token or refresh token, authorization denied' })
	}

	// Verify token
	try {
		const decoded = await jwt.verify(accessToken, config.get('jwtSecret'))

		req.user = decoded.user

		return next()
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			jwt.verify(accessToken, config.get('jwtSecret'), { ignoreExpiration: true }, async (err, decoded) => {
				const userId = decoded.user.id

				const redisToken = JSON.parse(await redisClient.getAsync(userId))

				if (!redisToken || redisToken.refresh_token !== refreshToken) {
					return res.status(401).json({ msg: 'Refresh token is not valid' })
				} else {
					if (redisToken.expired_at < Date.now()) {
						redisClient.del(userId)

						res.clearCookie('access_token')
						res.clearCookie('refresh_token')

						return res.status(401).json({ msg: 'Login timeout' })
					}

					const accessTokenNew = jwt.sign({ user: { id: userId } }, config.get('jwtSecret'), {
						expiresIn: config.get('jwtAccessExpiration')
					})

					await res.cookie('access_token', accessTokenNew, {
						secure: false,
						httpOnly: true,
						overwrite: true
					})

					req.user = decoded.user

					return next()
				}
			})
		} else {
			return res.status(401).json({ msg: 'Access token is not valid' })
		}
	}
}
