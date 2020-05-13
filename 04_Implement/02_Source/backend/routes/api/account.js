const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

var { APIStatus, MakeResponse } = require("../../utils/APIStatus.js")

const Account = require('../../models/Account')

router.post('/', [
    check('balance', 'Balance is required').not().notEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send(errors)
    }

    const { balance } = req.body
    const account_id = 1612558
    const account_type = "SAVING"

    try {
        const account = new Account({ account_id, account_type, balance })

        const response = await account.save()
        res.status(200).json(response)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.get('/', async (req, res) => {
    try {
        const { account_id } = req.body
        const response = await Account.findOne({ account_id })
        res.status(200).json(response)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

module.exports = router