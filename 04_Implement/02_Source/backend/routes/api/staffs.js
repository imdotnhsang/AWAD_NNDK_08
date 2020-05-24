const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
	res.send('Staff route')
})

module.exports = router
