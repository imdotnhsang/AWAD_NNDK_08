const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
	res.send('Debt Collection route')
})

module.exports = router
