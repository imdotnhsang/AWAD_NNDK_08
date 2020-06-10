const express = require('express')

const router = express.Router()
const auth = require('../../middlewares/auth')

const LinkedBank = require('../../models/LinkedBank')

// @route     POST /linked-banks/all-linked-banks
// @desc      Get all linked banks
// @access    Public
router.get('/all-linked-banks', auth, async (req, res) => {
	try {
		const data = await LinkedBank.find()

		const response = {
			msg: 'Linked banks successfully got.',
			data,
		}
		return res.status(200).json(response)
	} catch (error) {
		return res.status(500).json({ msg: 'Server error...' })
	}
})

module.exports = router