
var APIResponse = require('./APIResponse.js')

class DBModel {
    constructor() {

    }
    Create(colection,data) {
        return new Promise((resolve, reject) => {
            let modelName = colection.modelName
            colection.create(data,(err,obj) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err
                    }))
                }
                resolve(new APIResponse({
                    status: "OK",
                    data: [obj],
                    message: `Create ${modelName} successfully`,
                }))
            })
        })
       
    }
    Query(colection,query,select,offset,limit,reverse) {
        return new Promise((resolve,reject) => {
            let modelName = colection.modelName
            colection.find(query,select,{skip: offset, limit},(err,obj) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err
                    }))
                }
                resolve(new APIResponse({
                    status: "OK",
                    data: [obj],
                    message: `Find ${modelName} successfully`,
                }))
            }).sort({_id:reverse ? 1:-1})
        })
    }
    Count(collection,query) {
        return new Promise((resolve, reject) => {
            let modelName = collection.modelName
            collection.estimatedDocumentCount(query,(err,count) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err,
                        total: 0
                    }))
                }
                resolve(new APIResponse({
                    status: "OK",
                    message: `Count ${modelName} successfully`,
                    total: count
                }))
            })
        })
    }
}

module.exports = DBModel