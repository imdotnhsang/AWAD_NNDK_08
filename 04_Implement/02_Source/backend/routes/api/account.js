const express = require('express')
const router = express.Router()

const Account = require('../../models/Account')

router.post('/', (req, res) => {
    res.send('Account Route')
})

module.exports = route