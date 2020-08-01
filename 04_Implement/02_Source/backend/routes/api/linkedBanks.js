const express = require('express')

const router = express.Router()
const auth = require('../../middlewares/auth')
const { MakeResponse, APIStatus } = require('../../utils/APIStatus.js')

const PartnerBank = require('../../models/PartnerBank')
const DBModel = require('../../utils/DBModel')
const DBModelInstance = new DBModel()
// @route     POST /linked-banks/all-linked-banks
// @desc      Get all linked banks
// @access    Public
router.get('/all-linked-banks', async (req, res) => {
	try {
		// const data = await LinkedBank.find()

		// const response = {
		// 	msg: 'Linked banks successfully got.',
		// 	data,
		// }
		// return res.status(200).json(response)

		const result = await DBModelInstance.Query(PartnerBank,{},"bank_id bank_name",0,0,false)
		return MakeResponse(req,res,result)
	} catch (error) {
		return res.status(500).json({ msg: 'Server error...' })
	}
})

module.exports = router