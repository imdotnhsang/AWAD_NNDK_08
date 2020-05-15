const express = require('express')

const router = express.Router()
const auth = require('../../middleware/auth')
// const { check, validationResult } = require('express-validator')

const Account = require('../../models/Account')
const User = require('../../models/User')
const Transaction = require('../../models/Transaction')

router.put('/transfering-within-bank', auth, async (req, res) => {
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

    const fromAccountFullname = user.fullName
    const fromAccountId = user.defaultAccountId

    const transactionSender = new Transaction({
      entryTime,
      fromAccountId,
      fromAccountFullname,
      toAccountId,
      toAccountFullname,
      fromBankId: 'EIGHT',
      toBankId: 'EIGHT',
      typeTransaction: 'SEND',
      amountTransaction,
    })


    const transactionReceiver = new Transaction({
      entryTime,
      fromAccountId,
      fromAccountFullname,
      toAccountId,
      toAccountFullname,
      fromBankId: 'EIGHT',
      toBankId: 'EIGHT',
      typeTransaction: 'RECEIVE',
      amountTransaction,
    })

    const accountSenderResponse = await Account.findOneAndUpdate({ accountId: fromAccountId }, { $inc: { balance: -amountTransaction } }, {
      new: true,
    })

    const transactionSenderResponse = await transactionSender.save()

    const accountReceiverResponse = await Account.findOneAndUpdate({ accountId: toAccountId }, { $inc: { balance: amountTransaction } }, {
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

router.get('/receiver-information/:accountId', auth, async (req, res) => {
  try {
    const { accountId } = req.params

    const user = await User.findOne({ defaultAccountId: accountId })

    if (!user) {
      return res.status(400).json({
        errors: [{
          msg: 'User not exists',
        }],
      })
    }

    const { fullName } = user

    return res.status(200).json({ fullName })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

router.put('/sending-interbank', auth, async (req, res) => {
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

    const fromAccountFullname = user.fullName
    const fromAccountId = user.defaultAccountId

    const transactionSender = new Transaction({
      entryTime,
      fromAccountId,
      fromAccountFullname,
      toAccountId,
      toAccountFullname,
      fromBankId: 'EIGHT',
      toBankId,
      typeTransaction: 'SEND',
      amountTransaction,
    })

    const accountSenderResponse = await Account.findOneAndUpdate({ accountId: fromAccountId }, { $inc: { balance: -amountTransaction } }, {
      new: true,
    })

    const transactionSenderResponse = await transactionSender.save()

    return res.status(200).json({ transactionSenderResponse, accountSenderResponse })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

router.put('/receiving-interbank', async (req, res) => {
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
      entryTime,
      fromAccountId,
      fromAccountFullname,
      toAccountId,
      toAccountFullname,
      fromBankId,
      toBankId: 'EIGHT',
      typeTransaction: 'RECEIVE',
      amountTransaction,
    })

    const accountReceiverResponse = await Account.findOneAndUpdate({ accountId: toAccountId }, { $inc: { balance: amountTransaction } }, {
      new: true,
    })

    const transactionReceiverResponse = await transactionReceiver.save()

    res.status(200).json({ transactionReceiverResponse, accountReceiverResponse })
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
