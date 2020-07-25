
const DBModel = require('../utils/DBModel.js')
const Staff = require('../models/Staff.js')

module.exports = {
	getStaff: async (condition, select, offset, limit, reverse, getTotal) => {
	    let response = await new DBModel().Query(Staff,condition,select,offset,limit,reverse)
		if (response.status === 'OK' && getTotal) {
			const respTotal = await new DBModel().Count(Staff, condition)
			response.total = respTotal.total
		}
		return response
	}
}
