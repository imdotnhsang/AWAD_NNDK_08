const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

var { APIStatus, MakeResponse } = require("../../utils/APIStatus.js")

const Account = require('../../models/Account')
const User = require('../../models/User')
const Transaction = require('../../models/Transaction')

router.put('/transfering-within-bank', auth, async (req, res) => {
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

        const accountSenderResponse = await Account.findOneAndUpdate({ account_id: from_account_id }, { $inc: { balance: -amount_transaction } }, {
            new: true
        })

        const transactionSenderResponse = await transactionSender.save()

        const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: to_account_id }, { $inc: { balance: amount_transaction } }, {
            new: true
        })

        const transactionReceiverResponse = await transactionReceiver.save()

        res.status(200).json({ transactionSenderResponse, transactionReceiverResponse, accountSenderResponse, accountReceiverResponse })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.get('/receiver-information/:account_id', auth, async (req, res) => {
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

router.put('/sending-interbank', auth, async (req, res) => {
    const {
        entry_time,
        to_account_id,
        to_account_fullname,
        to_bank_id,
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
        const transactionSender = new Transaction({
            entry_time,
            from_account_id,
            from_account_fullname,
            to_account_id,
            to_account_fullname,
            from_bank_id: "EIGHT",
            to_bank_id,
            type_transaction: "SEND",
            amount_transaction
        })

        const accountSenderResponse = await Account.findOneAndUpdate({ account_id: from_account_id }, { $inc: { balance: -amount_transaction } }, {
            new: true
        })

        const transactionSenderResponse = await transactionSender.save()

        res.status(200).json({ transactionSenderResponse, accountSenderResponse })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.put('/receiving-interbank', async (req, res) => {
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

        const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: to_account_id }, { $inc: { balance: amount_transaction } }, {
            new: true
        })

        const transactionReceiverResponse = await transactionReceiver.save()

        res.status(200).json({ transactionReceiverResponse, accountReceiverResponse })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

module.exports = router