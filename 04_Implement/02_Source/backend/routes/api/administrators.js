const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
	res.send('Administrator route')
})

module.exports = router
