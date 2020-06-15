
const DBModel = require('../utils/DBModel.js')
const Customer = require('../models/Customer.js')

module.exports = {
	createCustomer: async (data) => {
		const response = await new DBModel().Create(Customer, data)
		return response
	},
	getCustomer: async (condition, select, offset, limit, reverse, getTotal) => {
	  let response = await new DBModel().Query(Customer,condition,select,offset,limit,reverse)
		//  let response = await new DBModel().Distinct(Customer,'email',{})
		//const response = await new DBModel().QueryS(Customer, condition, select, offset, limit, reverse)
		if (response.status === 'OK' && getTotal) {
			const respTotal = await new DBModel().Count(Customer, condition)
			response.total = respTotal.total
		}

		return response
	},
	updateCustomer: async (input) => {
		const filter = {
			role: input.role
		}

		const response = await new DBModel().Update(Customer, filter, input)
		return response
	},
	deleteCustomer: async (input) => {
		const response = await new DBModel().Delete(Customer, input)
		return response
	}
}
