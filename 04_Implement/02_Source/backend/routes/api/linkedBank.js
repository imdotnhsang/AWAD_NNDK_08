const express = require('express')
const RestClient = require('../../utils/HttpRequest')
const DBModel = require('../../utils/DBModel')
const client = new RestClient()

const router = express.Router()

router.post('/', (req, res) => {
	
})

router.get('/',async (req,res) => {
	let testClient = client.newRestClient(
	 'http://34.87.1.51/pms',
		 'test',
		60000,
		3,
	3,
	new DBModel()
	)
	let resp = await testClient.makeHTTPRequestProcess("POST",{},{
		// q: "{}",
		// getTotal:true
	},{
		categoryName: "Điện ảnh"
	},"/category",null)

//	console.log(resp)

	return res.status(200).json(resp.data)

})

module.exports = router
