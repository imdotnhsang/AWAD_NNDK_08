const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

var {APIStatus,MakeResponse} = require("../../utils/APIStatus.js")
const userAction = require("../../action/user.js")

const User = require('../../models/User')

router.post('/', [
    check('full_name', 'Full name is required').not().notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
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
        payment_account_id
    } = req.body

    try {
        let user = await User.findOne({ email })

        if (user) {
            res.status(400).json({
                errors: [{
                    msg: "User already exists"
                }]
            })
        }

        user = new User({
            full_name, email, phone_number, password, role, payment_account_id
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        // await user.save()
        await userAction.createUser(user)
        // const response = await userAction.createUser(user)
        // return MakeResponse(req,res,response)

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            }
        )
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