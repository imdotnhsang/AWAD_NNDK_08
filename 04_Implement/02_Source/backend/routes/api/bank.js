const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
  res.send('Bank route')
})

module.exports = router
