const express = require('express')
const router = express.Router()

var APIResponse = require('../../utils/APIResponse.js')
const {createUser, getUser, updateUser, deleteUser} = require('../../action/user.js')

// @route POST      api/users
// @desc            Register user
// @access          Public

router.post('/',  async (req, res) => {
    let user = {
        full_name: "Nguyễn Hoàng Sang",
        email: "im.nhsang@gmail.com",
        phone_number: "0399029922",
        password: "12345678",
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

    let response = await getUser(user,null,0,1000,true,true)

    res.status(200).json(response)
})

router.put("/", async (req,res) => {
    let input = {
        role: "CUSTOMER",
        full_name: "Sơn"
    }

    let response = await updateUser(input)
    res.status(200).json(response)

})

router.delete("/", async (req,res) => {
    let input = {
        phone_number: "0979279933"
    }

    let response = await deleteUser(input)
    res.status(200).json(response)
})

module.exports = router