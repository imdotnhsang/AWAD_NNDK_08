const express = require('express')

const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middlewares/auth')

const DebtCollection = require('../../models/DebtCollection')

// @route     POST /debt-collections/
// @desc      Add debt collection
// @access    Public
router.post(
	'/add',
	[
		auth,
		check('borrowerAccount', 'Borrower account is required').not().notEmpty(),
		check('lenderAccount', 'Lender account is required').not().notEmpty(),
		check('lenderFullname', 'Lender full name is required').not().notEmpty(),
		check('debtAmount', 'Please include a valid debt amount').isInt(),
	],
	(req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const {
			borroweAccount,
			lenderAccount,
			lenderFullname,
			debtAmount,
			debtMessage,
		} = req.body

		try {
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
		return res.status(200).json('POST /debt-collections/add')
	}
)

module.exports = router
