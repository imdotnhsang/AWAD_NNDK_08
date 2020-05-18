const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const {v4:uuidv4} = require('uuid')
const { check, validationResult } = require('express-validator')

const { MakeResponse } = require('../../utils/APIStatus.js')
const userAction = require('../../action/user.js')

const User = require('../../models/User')
const Account = require('../../models/Account')

// @route     POST /users
// @desc      Đăng kí user mới (BETA)
// @access    Public
router.post('/', [
  check('fullName', 'Full name is required').not().notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('balance', 'Please enter a balance with 0 or more').isAfter('49999')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).send(errors)
  }

  const {
    fullName,
    email,
    phoneNumber,
    password,
    role,
    balance
  } = req.body
  const accountType = 'DEFAULT'
  const accountId = '1612567'

  try {
    let user = await User.findOne({ email })

    if (user) {
      res.status(400).json({
        errors: [{
          msg: 'User already exists'
        }]
      })
    }

    let account = await Account.findOne({ account_id: accountId })

    if (account) {
      res.status(400).json({
        errors: [{
          msg: 'Account already exists'
        }]
      })
    }

    account = new Account({ account_id: accountId, account_type: accountType, balance })

    const responseAccountPost = await account.save()

    try {
      const defaultAccountId = responseAccountPost.account_id

      user = new User({
        full_name: fullName, email, phone_number: phoneNumber, password, role, default_account_id: defaultAccountId
      })

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      const response = await user.save()
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).send('Server error')
    }
  } catch (error) {
    return res.status(500).send('Server error')
  }
})

// @route     GET /users
// @desc      Lấy thông tin của user (BETA)
// @access    Public
router.get('/', async (req, res) => {
  const user = {
    role: 'CUSTOMER'
  }

  console.log(uuidv4())

  const response = await userAction.getUser(user, null, 0, 1000, true, true)
  return MakeResponse(req, res, response)
  // res.status(APIStatus.Ok).json(response)
})

// @route     PUT /users
// @desc      Cập nhật thông tin user (BETA)
// @access    Public
router.put('/', async (req, res) => {
  const input = {
    role: 'CUSTOMER',
    full_name: 'Sơn'
  }

  const response = await userAction.updateUser(input)
  return MakeResponse(req, res, response)
})

// router.delete("/", async (req, res) => {
//     const input = {
//         phone_number: "0979279933"
//     }

//     let response = await userAction.deleteUser(input)
//     return MakeResponse(req, res, response)
// })

module.exports = router
