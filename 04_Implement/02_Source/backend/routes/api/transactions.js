const express = require('express')

const router = express.Router()
const auth = require('../../middleware/auth')
// const { check, validationResult } = require('express-validator')

const Account = require('../../models/Account')
const User = require('../../models/User')
const Transaction = require('../../models/Transaction')

// @route     POST /transactions//transfering-within-bank
// @desc      Transfer within bank (BETA)
// @access    Public
router.post('/transfering-within-bank', auth, async (req, res) => {
  const {
    entryTime,
    toAccountId,
    toAccountFullname,
    amountTransaction,
  } = req.body

  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(400).json({
        errors: [{
          msg: 'User not exists',
        }],
      })
    }

    const fromAccountFullname = user.full_name
    const fromAccountId = user.default_account_id

    const transactionSender = new Transaction({
      entry_time: entryTime,
      from_account_id: fromAccountId,
      from_account_fullname: fromAccountFullname,
      to_account_id: toAccountId,
      to_account_fullname: toAccountFullname,
      from_bank_id: 'EIGHT',
      to_bank_id: 'EIGHT',
      type_transaction: 'SEND',
      amount_transaction: amountTransaction,
    })


    const transactionReceiver = new Transaction({
      entry_time: entryTime,
      from_account_id: fromAccountId,
      from_account_fullname: fromAccountFullname,
      to_account_id: toAccountId,
      to_account_fullname: toAccountFullname,
      from_bank_id: 'EIGHT',
      to_bank_id: 'EIGHT',
      type_transaction: 'RECEIVE',
      amount_transaction: amountTransaction,
    })

    const accountSenderResponse = await Account.findOneAndUpdate({ account_id: fromAccountId }, { $inc: { balance: -amountTransaction } }, {
      new: true,
    })

    const transactionSenderResponse = await transactionSender.save()

    const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: toAccountId }, { $inc: { balance: amountTransaction } }, {
      new: true,
    })

    const transactionReceiverResponse = await transactionReceiver.save()

    return res.status(200).json({
      transactionSenderResponse, transactionReceiverResponse, accountSenderResponse, accountReceiverResponse,
    })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

// @route     GET /transactions/receiver-withinbank/:accountId
// @desc      Get full name of receiver within bank (BETA)
// @access    Public
router.get('/receiver-withinbank/:accountId', auth, async (req, res) => {
  try {
    const { accountId } = req.params

    const user = await User.findOne({ default_account_id: accountId })

    if (!user) {
      return res.status(400).json({
        errors: [{
          msg: 'User not exists',
        }],
      })
    }

    const fullName = user.full_name

    return res.status(200).json({ fullName })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

// @route     GET /transactions/receiver-interbank/:accountId
// @desc      Get full name of receiver interbank (BETA)
// @access    Public
router.get('/receiver-interbank/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params

    const user = await User.findOne({ default_account_id: accountId })

    if (!user) {
      return res.status(400).json({
        errors: [{
          msg: 'User not exists',
        }],
      })
    }

    const fullName = user.full_name

    return res.status(200).json({ fullName })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

// @route     POST /transactions/receiver-information/:accountId
// @desc      Get full name of receiver (BETA)
// @access    Public
router.post('/sending-interbank', auth, async (req, res) => {
  const {
    entryTime,
    toAccountId,
    toAccountFullname,
    toBankId,
    amountTransaction,
  } = req.body

  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(400).json({
        errors: [{
          msg: 'User not exists',
        }],
      })
    }

    const fromAccountFullname = user.full_name
    const fromAccountId = user.default_account_id

    const transactionSender = new Transaction({
      entry_time: entryTime,
      from_account_id: fromAccountId,
      from_account_fullname: fromAccountFullname,
      to_account_id: toAccountId,
      to_account_fullname: toAccountFullname,
      from_bank_id: 'EIGHT',
      to_bank_id: toBankId,
      type_transaction: 'SEND',
      amount_transaction: amountTransaction,
    })

    const accountSenderResponse = await Account.findOneAndUpdate({ account_id: fromAccountId }, { $inc: { balance: -amountTransaction } }, {
      new: true,
    })

    const transactionSenderResponse = await transactionSender.save()

    return res.status(200).json({ transactionSenderResponse, accountSenderResponse })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

// @route     POST /transactions/receiver-information/:accountId
// @desc      Get full name of receiver (BETA)
// @access    Public
router.post('/receiving-interbank', async (req, res) => {
  const {
    entryTime,
    fromAccountId,
    fromAccountFullname,
    toAccountId,
    toAccountFullname,
    fromBankId,
    amountTransaction,
  } = req.body

  try {
    const transactionReceiver = new Transaction({
      entry_time: entryTime,
      from_account_id: fromAccountId,
      from_account_fullname: fromAccountFullname,
      to_account_id: toAccountId,
      to_account_fullname: toAccountFullname,
      from_bank_id: fromBankId,
      to_bank_id: 'EIGHT',
      type_transaction: 'RECEIVE',
      amount_transaction: amountTransaction,
    })

    const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: toAccountId }, { $inc: { balance: amountTransaction } }, {
      new: true,
    })

    const transactionReceiverResponse = await transactionReceiver.save()

    res.status(200).json({ transactionReceiverResponse, accountReceiverResponse })
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
