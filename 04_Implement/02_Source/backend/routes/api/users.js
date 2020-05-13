const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

var { APIStatus, MakeResponse } = require("../../utils/APIStatus.js")
const userAction = require("../../action/user.js")

const User = require('../../models/User')

router.post('/', [
    check('full_name', 'Full name is required').not().notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('balance', 'Balance is required').not().notEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send(errors)
    }

    const {
        full_name,
        email,
        phone_number,
        password,
        role,
        balance
    } = req.body
    const account_type = "DEFAULT"
    const account_id = 1612556

    try {
        let user = await User.findOne({ email })

        if (user) {
            res.status(400).json({
                errors: [{
                    msg: "User already exists"
                }]
            })
        }
        
        let account = await Account.findOne({ account_id })

        if (account) {
            res.status(400).json({
                errors: [{
                    msg: "Account already exists"
                }]
            })
        }

        account = new Account({ account_id, account_type, balance })

        const responseAccountPost = await account.save()

        try {
            const default_account_id = responseAccountPost.account_id

            user = new User({
                full_name, email, phone_number, password, role, default_account_id
            })

            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            const response = await userAction.createUser(user)
            return MakeResponse(req, res, response)
        } catch (error) {
            console.log(error.message)
            res.status(500).send("Server error")
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server error")
    }
})


router.get("/", async (req, res) => {
    const user = {
        role: "CUSTOMER",
    }

    let response = await userAction.getUser(user, null, 0, 1000, true, true)
    return MakeResponse(req, res, response)
    // res.status(APIStatus.Ok).json(response)
})

router.put("/", async (req, res) => {
    const input = {
        role: "CUSTOMER",
        full_name: "Sơn"
    }

    let response = await userAction.updateUser(input)
    return MakeResponse(req, res, response)

})

router.delete("/", async (req, res) => {
    const input = {
        phone_number: "0979279933"
    }

    let response = await userAction.deleteUser(input)
    return MakeResponse(req, res, response)
})

module.exports = router