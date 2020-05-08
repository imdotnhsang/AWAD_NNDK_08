
var DBModel = require("../utils/DBModel.js")
var User = require("../models/user.js")


module.exports = {
    createUser: async (data) => {
        let response = await new DBModel().Create(User,data)
        return response
    },
    getUser: async (condition,select, offset,limit,reverse, getTotal) => {
        let response = await new DBModel().Query(User,condition,select,offset,limit,reverse)

        if (response.status == "OK" && getTotal) {
            let respTotal = await new DBModel().Count(User,condition)
            response.total = respTotal.total
        }

        return response
    }
}