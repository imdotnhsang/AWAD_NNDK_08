const express = require('express')

const router = express.Router()
// const auth = require('../../middlewares/auth')
// const { APIStatus, MakeResponse } = require('../../utils/APIStatus')
// const DBModel = require('../../utils/DBModel')

// const DBModelInstance = new DBModel()

// const Account = require('../../models/Account')
// const Customer = require('../../models/Customer')

// @route     GET /accounts
// @desc      Lấy thông tin tài khoản ngân hàng
// @access    Public
// router.get('/', auth, async (req, res) => {
// 	try {
// 		if (!req.query.accountId) {
// 			return MakeResponse(req, res, {
// 				status: APIStatus.Invalid,
// 				message: 'Require accountId',
// 			})
// 		}

// 		let result = await DBModelInstance.Query(
// 			Account,
// 			{ account_id: req.query.accountId },
// 			null,
// 			0,
// 			1,
// 			false
// 		)
// 		if (result.status != APIStatus.Ok) {
// 			return MakeResponse(req, res, {
// 				status: APIStatus.NotFound,
// 				message: 'Not found any matched accountId',
// 			})
// 		}

// 		result = await DBModelInstance.Query(
// 			Customer,
// 			{ default_account_id: req.query.accountId },
// 			'full_name',
// 			0,
// 			1,
// 			false
// 		)

// 		if (result.status == APIStatus.Ok) {
// 			return MakeResponse(req, res, result)
// 		}

// 		if (result.status != APIStatus.NotFound) {
// 			return MakeResponse(req, res, result)
// 		}

// 		result = await DBModelInstance.Query(
// 			Customer,
// 			{
// 				saving_accounts_id: {
// 					$in: [req.query.accountId],
// 				},
// 			},
// 			'full_name',
// 			0,
// 			1,
// 			false
// 		)

// 		return MakeResponse(req, res, result)
// 	} catch (err) {
// 		return res.status(500).json({
// 			status: APIStatus.Error,
// 			message: err,
// 		})
// 	}
// })

module.exports = router
