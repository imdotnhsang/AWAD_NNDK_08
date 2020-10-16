const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')

const auth = require('../../middlewares/auth')
const administrator = require('../../middlewares/administrator')

const Transaction = require('../../models/Transaction')
const Staff = require('../../models/Staff')
const { MakeResponse, APIStatus } = require('../../utils/APIStatus.js')
const { GetQuery } = require('../../utils/GetQuery.js')
const DBModel = require('../../utils/DBModel.js')
const StaffAction = require('../../action/staff')
const { count, baseModelName } = require('../../models/Transaction')

var ObjectId = require('mongoose').Types.ObjectId

const DBModelInstance = new DBModel()
// @route     GET /administrators/all-staffs
// @desc      Get all information administrator page
// @access    Private (administrator)
router.get('/all-staffs', [auth, administrator], async (req, res) => {
	try {

		const offset = GetQuery('offset', req)
		const limit = GetQuery('limit', req)
		const reverse = GetQuery('reverse', req)
		const getTotal = GetQuery('getTotal', req)
		const search = GetQuery('search',req)


		let resultFindCurrent = await StaffAction.getStaff({
			_id: new ObjectId(req.user.id)
		},null,0,1,false,false)

		let email = ""

		if (resultFindCurrent.status == APIStatus.Ok) {
			email = resultFindCurrent.data[0].email
		} else {
			return MakeResponse(req, res, resultFindCurrent)
		}

		

		let result = []
		if (search && search != '') {
			result = await StaffAction.getStaff(
				{
					$or: [
						{email:new RegExp(search, "i")},
						{full_name: new RegExp(search, "i")},
						{phone_number: new RegExp(search, "i")}
					],
					email: {
						$ne: email
					}
				},
				null,
				offset,
				limit,
				reverse,
				getTotal
			)
		} else {
			result = await StaffAction.getStaff(
				{
					email: {
						$ne: email
					}
				},
				null,
				offset,
				limit,
				reverse,
				getTotal
			)
		}
		// const allStaffs = await Staff.find({}, { _id: 0, __v: 0 })

		// const response = {
		// 	msg: 'All staffs successfully got.',
		// 	data: allStaffs,
		// }
		// return res.status(200).json(response)
		return MakeResponse(req, res, result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ msg: 'Server error...' })
	}
})

// @route     POST /administrator/register-staff
// @desc      Create new staff (employee or administrator)
// @access    Private (administrator)
router.post(
	'/register-staff',
	[
		auth,
		administrator,
		check('fullName', 'Full name is required').not().notEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('phoneNumber', 'Please include a valid phone number').isLength({
			min: 10,
			max: 10,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { fullName, email, phoneNumber, positionRegister } = req.body

		const username = email.split('@')[0].toLowerCase()

		try {
			const isExist = await Staff.countDocuments({
				$or: [{ email }, { phone_number: phoneNumber }],
			})
			if (isExist) {
				return res.status(400).json({
					errors: [{ msg: 'Email or phone number already exists.' }],
				})
			}

			if (
				positionRegister !== 'EMPLOYEE' &&
				positionRegister !== 'ADMINISTRATOR'
			) {
				return res.status(400).json({
					errors: [{ msg: 'Position register does not exist.' }],
				})
			}

			const nanoidPassword = customAlphabet(
				'1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
				8
			)
			const password = nanoidPassword()

			const staff = new Staff({
				username,
				email: email.toLowerCase(),
				phone_number: phoneNumber,
				password,
				full_name: fullName,
				position: positionRegister,
				created_at: Date.now(),
				is_active: true,
			})

			const salt = await bcrypt.genSalt(10)
			staff.password = await bcrypt.hash(password, salt)

			const responseStaff = await staff.save()

			let response = {}
			if (positionRegister === 'EMPLOYEE') {
				response = {
					msg: 'Employee successfully created.',
					data: {
						login_info: {
							username,
							password,
						},
						personal_info: {
							full_name: responseStaff.full_name,
							phone_number: responseStaff.phone_number,
							email: responseStaff.email,
							position: responseStaff.position,
							created_at: responseStaff.created_at,
						},
					},
				}
			} else if (positionRegister === 'ADMINISTRATOR') {
				response = {
					msg: 'Administrator successfully created.',
					data: {
						username,
						password,
					},
				}
			}
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /administrators/update-staff
// @desc      Update information staff (full name, email => username)
// @access    Private (administrator)
router.put(
	'/update-staff',
	[
		auth,
		administrator,
		check('username', 'Username is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username, fullName, email } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists.',
						},
					],
				})
			}

			if (!email && !fullName) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Full name or email is required.',
						},
					],
				})
			}

			const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/gm
			if (email && re.test(String(email)) === false) {
				return res.status(400).json({
					errors: [{ msg: 'Please include a valid email.' }],
				})
			}

			const newEmail = email || staff.email
			const newFullname = fullName || staff.full_name

			if (newEmail === staff.email && newFullname === staff.full_name) {
				return res.status(400).json({
					errors: [
						{
							msg: 'New information cannot coincide with old information.',
						},
					],
				})
			}

			const isExist = email && (await Staff.countDocuments({ email }))
			if (isExist) {
				return res.status(400).json({
					errors: [
						{
							msg: 'New email already exists.',
						},
					],
				})
			}

			staff.full_name = newFullname
			staff.email = newEmail
			// staff.username = email.split('@')[0].toLowerCase()
			await staff.save()

			const response = { msg: 'Staff successfully updated.' }
			return res.status(200).json(response)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /administrators/deactivate-staff
// @desc      Deactivate any staff
// @access    Private (administrator)
router.put(
	'/deactivate-staff',
	[
		auth,
		administrator,
		check('username', 'Username is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists.',
						},
					],
				})
			}

			if (!staff.is_active) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff was deactivated.',
						},
					],
				})
			}

			staff.is_active = false
			await staff.save()

			const response = { msg: 'Staff successfully deactivated.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     PUT /administrators/activate-staff
// @desc      Active any staff which was deactivated
// @access    Private (administrator)
router.put(
	'/activate-staff',
	[
		auth,
		administrator,
		check('username', 'Username is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const { username } = req.body

		try {
			const staff = await Staff.findOne({ username })
			if (!staff) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff not exists.',
						},
					],
				})
			}

			if (staff.is_active) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Staff was activated.',
						},
					],
				})
			}

			staff.is_active = true
			await staff.save()

			const response = { msg: 'Staff successfully activated.' }
			return res.status(200).json(response)
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     GET /administrators/all-interbank-transactions
// @desc      Get all interbank transactions
// @access    Private (administrator)
router.get(
	'/all-interbank-transactions',
	[auth, administrator],
	async (req, res) => {
		const q = GetQuery("q",req)
		const offset = GetQuery('offset', req)
		const limit = GetQuery('limit', req)
		const reverse = GetQuery('reverse', req)
		const getTotal = GetQuery('getTotal', req)

		try {
	
			let result = await DBModelInstance.Query(Transaction,JSON.parse(q),null,offset,limit,reverse)
			if (result.status != APIStatus.Ok) {
				return MakeResponse(req,res,result)
			}

			if (getTotal) {
				const countResp = await DBModelInstance.Count(Transaction,JSON.parse(q))
				if (countResp.status == APIStatus.Ok) {
					result.total = countResp.total
				}
			}

			let totalTransfer = 0
			let totalReceive = 0

			let countData = await DBModelInstance.Query(Transaction,JSON.parse(q),null,0,0,true)
			if (countData.status == APIStatus.Ok) {
				const n = countData.data.length
				for (let i=0;i<n;i++) {
					if (countData.data[i].transaction_type == "TRANSFER") {
						totalTransfer = totalTransfer + countData.data[i].transaction_amount
					} else if (countData.data[i].transaction_type == "RECEIVE") {
						totalReceive = totalReceive + countData.data[i].transaction_amount
					}
				}
			}



			
			return MakeResponse(req,res,{
				status: APIStatus.Ok,
				data: 
					{
						listTransaction: result.data,
						totalTransfer,
						totalReceive
					}
				,
				total: result.total
			})
		
		} catch (error) {
			return res.status(500).json({
				msg: 'Server error...',
			})
		}
	}
)

module.exports = router
