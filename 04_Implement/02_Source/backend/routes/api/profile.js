const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    res.send("Profile route")
})

module.exports = router