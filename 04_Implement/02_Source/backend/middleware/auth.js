const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  // Get token from Header
  const token = req.header('x-auth-token')

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))

    req.user = decoded.user
    return next()
  } catch (error) {
    return res.status(401).json({ msg: 'Token is not valid' })
  }
}
