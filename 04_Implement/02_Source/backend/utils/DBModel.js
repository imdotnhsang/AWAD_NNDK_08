/* eslint-disable class-methods-use-this */

const APIResponse = require('./APIResponse.js')
const { APIStatus } = require('./APIStatus.js')

class DBModel {
	// constructor() {}

	Create(collection, data) {
		return new Promise((resolve) => {
			const { modelName } = collection
			collection.create(data, (err, docs) => {
				if (err) {
					resolve(new APIResponse({
						status: APIStatus.Error,
						message: err,
					}))
				}
				resolve(new APIResponse({
					status: APIStatus.Ok,
					data: Array.isArray(docs) ? docs : [docs],
					message: `Create ${modelName} successfully`,
				}))
			})
		})
	}

	Query(collection, filter, select, offset, limit, reverse) {
		return new Promise((resolve) => {
			const { modelName } = collection
			collection.find(filter, select, { skip: offset, limit }, (err, docs) => {
				if (err) {
					resolve(new APIResponse({
						status: APIStatus.Error,
						message: err,
					}))
				}
				if (docs.length == 0) {
					resolve(new APIResponse({
						status: APIStatus.NotFound,
						message: `Not found any matched ${modelName}`
					}))
				}
				resolve(new APIResponse({
					status: APIStatus.Ok,
					data: Array.isArray(docs) ? docs : [docs],
					message: `Find ${modelName} successfully`,
				}))
			}).sort({ _id: reverse ? 1 : -1 })
		})
	}

	QueryS(collection, filter, select, offset, limit, sortObject) {
		return new Promise((resolve) => {
			const { modelName } = collection
			collection.find(filter, select, { skip: offset, limit }, (err, docs) => {
				if (err) {
					resolve(new APIResponse({
						status: APIStatus.Error,
						message: err,
					}))
				}
				if (!docs || docs.length == 0) {
					resolve(new APIResponse({
						status: APIStatus.NotFound,
						message: `Not found any matched ${modelName}`
					}))
				}
				resolve(new APIResponse({
					status: APIStatus.Ok,
					data: Array.isArray(docs) ? docs : [docs],
					message: `Find ${modelName} successfully`,
				}))
			}).sort(sortObject)
		})
	}

	Count(collection, filter) {
		return new Promise((resolve) => {
			const { modelName } = collection
			collection.estimatedDocumentCount(filter, (err, count) => {
				if (err) {
					resolve(new APIResponse({
						status: APIStatus.Error,
						message: err,
						total: 0,
					}))
				}
				resolve(new APIResponse({
					status: APIStatus.Ok,
					message: `Count ${modelName} successfully`,
					total: count,
				}))
			})
		})
	}

	UpdateOne(collection, filter, updater) {
		return new Promise((resolve) => {
			const { modelName } = collection
			collection.findOneAndUpdate(filter, updater, { new: false }, (err) => {
				if (err) {
					resolve(new APIResponse({
						status: APIStatus.Error,
						message: err,
					}))
				}
				resolve(new APIResponse({
					status: APIStatus.Ok,
					//  data: Array.isArray(docs) ? docs : [docs],
					message: `Update ${modelName} successfully`,
				}))
			})
		})
	}

	Update(collection, filter, updater) {
		return new Promise((resolve) => {
			const { modelName } = collection
			collection.update(filter, updater, { multi: true }, (err) => {
				if (err) {
					resolve(new APIResponse({
						status: APIStatus.Error,
						message: err,
					}))
				}
				resolve(new APIResponse({
					status: APIStatus.Ok,
					// data: Array.isArray(docs) ? docs : [docs],
					message: `Update ${modelName} successfully`,
				}))
			})
		})
	}

	Delete(collection, filter) {
		return new Promise((resolve) => {
			const { modelName } = collection
			collection.deleteMany(filter, (err) => {
				if (err) {
					resolve(new APIResponse({
						status: APIStatus.Error,
						message: err,
					}))
				}
				resolve(new APIResponse({
					status: APIStatus.Ok,
					// data: Array.isArray(docs) ? docs : [docs],
					message: `Delete ${modelName} successfully`,
				}))
			})
		})
	}

	Distinct(collection, field, filter) {
		return new Promise((resolve) => {
			collection.distinct(field, filter, (err, docs) => {
				if (err) {
					resolve({
						status: APIStatus.Error,
						message: err,
					})
				}
				resolve({
					status: APIStatus.Ok,
					data: docs,
					message: `Distinct ${field} successfully`,
				})
			})
		})
	}
}

module.exports = DBModel
