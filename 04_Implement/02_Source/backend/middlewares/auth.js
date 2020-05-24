const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = async (req, res, next) => {
	// Get accesstoken from Header
	const accessToken = req.header('x-auth-access-token')

	// Check if not accesstoken
	if (!accessToken) {
		return res.status(401).json({ msg: 'No access token, authorization denied' })
	}

	// Verify accesstoken
	try {
		const decoded = await jwt.verify(accessToken, config.get('jwtSecret'))

		req.user = decoded.user

		return next()
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ msg: 'Token expired error' })
		}

		return res.status(401).json({ msg: 'Token is not valid' })
	}
}
