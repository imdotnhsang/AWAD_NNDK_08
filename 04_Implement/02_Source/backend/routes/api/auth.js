const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    res.send("Auth route")
})

module.exports = router