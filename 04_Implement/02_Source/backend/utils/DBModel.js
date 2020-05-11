
var APIResponse = require('./APIResponse.js')

class DBModel {
    constructor() {

    }
    Create(colection,data) {
        return new Promise((resolve, reject) => {
            const modelName = colection.modelName
            colection.create(data,(err,docs) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err
                    }))
                }
                resolve(new APIResponse({
                    status: "OK",
                    data: Array.isArray(docs) ? docs : [docs],
                    message: `Create ${modelName} successfully`,
                }))
            })
        })
       
    }
    Query(colection,filter,select,offset,limit,reverse) {
        return new Promise((resolve,reject) => {
            const modelName = colection.modelName
            colection.find(filter,select,{skip: offset, limit},(err,docs) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err
                    }))
                }
                resolve(new APIResponse({
                    status: "OK",
                    data: Array.isArray(docs) ? docs : [docs],
                    message: `Find ${modelName} successfully`,
                }))
            }).sort({_id:reverse ? 1:-1})
        })
    }

    Count(collection,filter) {
        return new Promise((resolve, reject) => {
            const modelName = collection.modelName
            collection.estimatedDocumentCount(filter,(err,count) => {
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

    UpdateOne(collection,filter,updater) {
        return new Promise((resolve,reject) => {
            const modelName = collection.modelName
            collection.findOneAndUpdate(filter,updater,{new:false}, (err,docs) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err
                    }))
                }
                resolve(new APIResponse({
                    status : "OK",
                  //  data: Array.isArray(docs) ? docs : [docs],
                    message: `Update ${modelName} successfully`,
                }))
            })
        })
    }

    Update(collection,filter,updater) {
        return new Promise((resolve,reject) => {
            const modelName = collection.modelName
            collection.update(filter,updater,{multi:true}, (err,docs) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err
                    }))
                }
                resolve(new APIResponse({
                    status : "OK",
                   // data: Array.isArray(docs) ? docs : [docs],
                    message: `Update ${modelName} successfully`,
                }))
            })
        })
    }

    Delete(collection,filter) {
        return new Promise((resolve, reject) => {
            const modelName = collection.modelName
            collection.deleteMany(filter,(err) => {
                if (err) {
                    resolve(new APIResponse({
                        status: "INVALID",
                        message: err
                    }))
                }
                resolve(new APIResponse({
                    status : "OK",
                   // data: Array.isArray(docs) ? docs : [docs],
                    message: `Delete ${modelName} successfully`,
                }))
            })
        })
    }

}

module.exports = DBModel