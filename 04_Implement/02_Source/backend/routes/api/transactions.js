const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

var { APIStatus, MakeResponse } = require("../../utils/APIStatus.js")

const Account = require('../../models/Account')
const User = require('../../models/User')
const Transaction = require('../../models/Transaction')
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

router.get('/receiver-account/:account_id', async (req, res) => {
    try {
        const { account_id } = req.params

        const user = await User.findOne({ default_account_id: account_id })

        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: "User not exists"
                }]
            })
        }

        const { full_name } = user

        return res.status(200).json({ full_name })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ msg: 'Server error' })
    }
})

router.put('/within-bank', auth, async (req, res) => {
    const {
        entry_time,
        to_account_id,
        to_account_fullname,
        amount_transaction
    } = req.body

    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: "User not exists"
                }]
            })
        }

        const from_account_fullname = user.full_name
        const from_account_id = user.default_account_id

        const transactionSender = new Transaction({
            entry_time,
            from_account_id,
            from_account_fullname,
            to_account_id,
            to_account_fullname,
            from_bank_id: "EIGHT",
            to_bank_id: "EIGHT",
            type_transaction: "SEND",
            amount_transaction
        })


        const transactionReceiver = new Transaction({
            entry_time,
            from_account_id,
            from_account_fullname,
            to_account_id,
            to_account_fullname,
            from_bank_id: "EIGHT",
            to_bank_id: "EIGHT",
            type_transaction: "RECEIVE",
            amount_transaction
        })

        const transactionSenderResponse = await transactionSender.save()

        const transactionReceiverResponse = await transactionReceiver.save()

        const accountSenderResponse = await Account.findOneAndUpdate({ account_id: from_account_id }, { $inc: { balance: -amount_transaction } }, {
            new: true
        })

        const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: to_account_id }, { $inc: { balance: amount_transaction } }, {
            new: true
        })

        res.status(200).json({ transactionSenderResponse, transactionReceiverResponse, accountSenderResponse, accountReceiverResponse })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.put('/interbank', async (req, res) => {
    const {
        entry_time,
        from_account_id,
        from_account_fullname,
        to_account_id,
        to_account_fullname,
        from_bank_id,
        amount_transaction,
    } = req.body

    try {
        const transactionReceiver = new Transaction({
            entry_time,
            from_account_id,
            from_account_fullname,
            to_account_id,
            to_account_fullname,
            from_bank_id,
            to_bank_id: "EIGHT",
            type_transaction: "RECEIVE",
            amount_transaction
        })

        const transactionReceiverResponse = await transactionReceiver.save()

        const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: to_account_id }, { $inc: { balance: amount_transaction } }, {
            new: true
        })

        res.status(200).json({ transactionReceiverResponse, accountReceiverResponse })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})


module.exports = router