
var DBModel = require("../utils/DBModel.js")
var User = require("../models/User.js")


module.exports = {
    createUser: async (data) => {
        const response = await new DBModel().Create(User,data)
        return response
    },
    getUser: async (condition,select, offset,limit,reverse, getTotal) => {
        const response = await new DBModel().Query(User,condition,select,offset,limit,reverse)

        if (response.status == "OK" && getTotal) {
            const respTotal = await new DBModel().Count(User,condition)
            response.total = respTotal.total
        }

        return response
    },
    updateUser: async (input) => {
        const filter = {
            role: input.role
        }

        const response = await new DBModel().Update(User,filter,input)
        return response
    },
    deleteUser: async (input) => {
        const response = await new DBModel().Delete(User,input)
        return response
    }
}