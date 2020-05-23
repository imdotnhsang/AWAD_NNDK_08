const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
	res.send('Receiver route')
})

module.exports = router
