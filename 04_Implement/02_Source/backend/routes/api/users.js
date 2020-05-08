const express = require('express')
const router = express.Router()

var APIResponse = require('../../utils/APIResponse.js')
const {createUser, getUser} = require('../../action/user.js')

// @route POST      api/users
// @desc            Register user
// @access          Public

router.post('/',  async (req, res) => {
    let user = {
        full_name: "Nguyễn Hoàng Sang",
        email: "nhsanghcmus@gmail.com",
        phone_number: "0979279933",
        password: "123456",
        role: "CUSTOMER",
        payment_account_id: "1612556",
    }
    let response = await createUser(user)
    return res.status(200).json(response)
})

router.get("/", async (req,res) => {
    let user = {
        role: "CUSTOMER",
    }

    let response = await getUser(user,'email',0,1000,true,true)

    res.status(200).json(response)
})

module.exports = router