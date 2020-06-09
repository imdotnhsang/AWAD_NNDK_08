const express = require('express')
const RestClient = require('../../utils/HttpRequest')
const DBModel = require('../../utils/DBModel')
const LinkedBank = require('../../models/LinkedBank')
const {MakeResponse} = require('../../utils/APIStatus')
const client = new RestClient()

const DBModelInstance = new DBModel()

const router = express.Router()

router.post('/', (req, res) => {
	
})

router.get('/',async (req,res) => {
	// let testClient = client.newRestClient(
	//  	'http://localhost:5000/api/v1/auth/login',
	// 	60,
	// 	3,
	// 	3,
	// 	new DBModel()
	// )

	let result = await DBModelInstance.Query(LinkedBank,null,'bank_name bank_id partner_code',0,0,false)

	result.total = result.data.length

	return MakeResponse(req,res,result)

})






module.exports = router
