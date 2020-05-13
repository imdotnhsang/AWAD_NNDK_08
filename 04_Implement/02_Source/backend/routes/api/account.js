const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

var { APIStatus, MakeResponse } = require("../../utils/APIStatus.js")

const Account = require('../../models/Account')
const User = require('../../models/User')

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

router.get('/me', auth, async (req, res) => {
    try {
        const user = (await User.findById(req.user.id))

        if(!user){
            res.status(400).json({
                errors:[{
                    msg: "User not exists"
                }]
            })
        }

        let { full_name, default_account_id } = user

        full_name = full_name.toLowerCase()
        full_name = full_name.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        full_name = full_name.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        full_name = full_name.replace(/ì|í|ị|ỉ|ĩ/g, "i")
        full_name = full_name.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        full_name = full_name.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        full_name = full_name.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        full_name = full_name.replace(/đ/g, "d")
        full_name = full_name.toUpperCase()

        const account = await Account.findOne({ account_id: default_account_id })

        res.status(200).json({ full_name, account })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.get('/', async (req, res) => {
    try {
        const { account_id } = req.body

        const user =  await User.findOne({ default_account_id: account_id })

        if(!user){
            res.status(400).json({
                errors:[{
                    msg: "User not exists"
                }]
            })
        }

        let full_name = user.full_name.toLowerCase()
        full_name = full_name.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        full_name = full_name.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        full_name = full_name.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        full_name = full_name.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        full_name = full_name.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        full_name = full_name.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        full_name = full_name.replace(/đ/g, "d");
        full_name = full_name.toUpperCase();

        res.status(200).json({ full_name })
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