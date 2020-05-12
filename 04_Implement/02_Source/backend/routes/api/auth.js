const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send(errors)
    }

    const {
        email,
        password,
    } = req.body

    try {
        let user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({
                errors: [{
                    msg: "Invalid Credentials"
                }]
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            res.status(400).json({
                errors: [{
                    msg: "Invalid Credentials"
                }]
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
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

module.exports = router