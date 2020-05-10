const express = require('express')
const router = express.Router()

var APIResponse = require('../../utils/APIResponse.js')
var {APIStatus,MakeResponse} = require("../../utils/APIStatus.js")
const userAction = require("../../action/user.js")
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
    let response = await userAction.createUser(user)
    return MakeResponse(req,res,response)
})

router.get("/", async (req,res) => {
    let user = {
        role: "CUSTOMER",
    }

    let response = await userAction.getUser(user,null,0,1000,true,true)
    return MakeResponse(req,res,response)
   // res.status(APIStatus.Ok).json(response)
})

router.put("/", async (req,res) => {
    let input = {
        role: "CUSTOMER",
        full_name: "Sơn"
    }

    let response = await userAction.updateUser(input)
    return MakeResponse(req,res,response)

})

router.delete("/", async (req,res) => {
    let input = {
        phone_number: "0979279933"
    }

    let response = await userAction.deleteUser(input)
    return MakeResponse(req,res,response)
})

module.exports = router