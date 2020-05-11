const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator/check')

var APIResponse = require('../../utils/APIResponse.js')
const { createUser, getUser, updateUser, deleteUser } = require('../../action/user.js')

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

        user.password = await bcrypt.hash(password,salt)

        await user.save()

        const response = await createUser(user)
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server error")
    }
})

router.get("/", async (req, res) => {
    const user = {
        role: "CUSTOMER",
    }

    const response = await getUser(user, null, 0, 1000, true, true)

    res.status(200).json(response)
})

router.put("/", async (req, res) => {
    const input = {
        role: "CUSTOMER",
        full_name: "Sơn"
    }

    const response = await updateUser(input)
    res.status(200).json(response)

})

router.delete("/", async (req, res) => {
    const input = {
        phone_number: "0979279933"
    }

    const response = await deleteUser(input)
    res.status(200).json(response)
})

module.exports = router