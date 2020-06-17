const express = require('express')
const router = express.Router()

const auth = require('../../middlewares/auth')

const DebtCollection = require('../../models/DebtCollection')
const Customer = require('../../models/Customer')

// @route     PUT /debt-collections/seen-notifcations
// @desc      Cancel debt collections
// @access    Public
router.put('/seen-notifications', [auth], async (req, res) => {
	const { debtCollectionsId } = req.body

	try {
		const customer = await Customer.findById(req.user.id)
		if (!customer) {
			return res.status(400).json({
				errors: [{ msg: 'Customer not exists.' }],
			})
		}

		debtCollectionsId.map(
			async (e) => await DebtCollection.findByIdAndUpdate(e, { is_seen: true })
		)

		const response = { msg: 'Debt collections successfully seen.' }
		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error...' })
	}
})

module.exports = router
