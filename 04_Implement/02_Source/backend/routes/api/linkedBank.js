const express = require('express')
const RestClient = require('../../utils/HttpRequest')
const DBModel = require('../../utils/DBModel')
const client = new RestClient()

const router = express.Router()

router.post('/', (req, res) => {
	
})

router.get('/',async (req,res) => {
	let testClient = client.newRestClient(
	 'http://localhost/translate',
		 'test',
		60,
		3,
	3,
	new DBModel()
	)
	let resp = await testClient.makeHTTPRequestProcess("GET",{
		Accept: "application/json"
	},{},null,"",null)

//	console.log(resp)

	return res.status(200).json(resp.data)

})

module.exports = router
