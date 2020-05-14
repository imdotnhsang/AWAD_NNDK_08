const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

var { APIStatus, MakeResponse } = require("../../utils/APIStatus.js")

const Account = require('../../models/Account')
const User = require('../../models/User')

// function change_alias(full_name) {
//     let str = full_name
//     str = str.toLowerCase()
//     str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
//     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
//     str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
//     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
//     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
//     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
//     str = str.replace(/đ/g, "d")
//     str = str.toUpperCase()
//     return str
// }

router.post('/', [check('balance', 'Balance is required').not().notEmpty()], async (req, res) => {
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

router.get('/', auth, async (req, res) => {
    try {
        const user = (await User.findById(req.user.id))

        if (!user) {
            res.status(400).json({
                errors: [{
                    msg: "User not exists"
                }]
            })
        }

        const { full_name, default_account_id } = user

        const account = await Account.findOne({ account_id: default_account_id })

        if (!account) {
            res.status(400).json({
                errors: [{
                    msg: "Account not exists"
                }]
            })
        }

        res.status(200).json({ full_name, account })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.put('/', async (req, res) => {
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