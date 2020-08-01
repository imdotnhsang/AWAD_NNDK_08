const express = require('express')
const moment = require('moment')
var hash = require('object-hash');

const router = express.Router()
// const { customAlphabet } = require('nanoid')
const { check, validationResult } = require('express-validator')
// const NodeRSA = require('node-rsa')
const auth = require('../../middlewares/auth')
const crypto = require('crypto')
const openpgp = require('openpgp')
// const { sendOTPCode } = require('../../utils/OTP/sendOTP.js')

const { MakeResponse, APIStatus } = require('../../utils/APIStatus.js')

const Account = require('../../models/Account')
const Customer = require('../../models/Customer')
const Transaction = require('../../models/Transaction')
const LinkedBank = require('../../models/LinkedBank')
const AccessedApiHistory = require('../../models/AccessedApiHistory')
const DBModel = require('../../utils/DBModel')
const PartnerBank = require('../../models/PartnerBank')
const RestClient = require("../../utils/HttpRequest")
const APIResponse = require('../../utils/APIResponse')
const { time } = require('console');
const customer = require('../../action/customer');

const DBModelInstance = new DBModel()

const client = new RestClient()

const S2QClient = client.newRestClient("https://s2q-ibanking.herokuapp.com",15000,3,3000,DBModelInstance)
const BaoSonClient = client.newRestClient("https://ptwncinternetbanking.herokuapp.com/banks",15000,3,3000,DBModelInstance)

// @route     POST /transactions/transferring-within-bank
// @desc      Transfer internal bank
// @access    Public
router.post(
	'/transferring-internal-banking',
	[
		auth,
		check('otp', 'Please include a valid OTP')
			.isInt()
			.isLength({ min: 6, max: 6 }),
		check('toAccountId', 'Receiver account is required').not().notEmpty(),
		check('toFullName', 'Receiver full name is required').not().notEmpty(),
		check('transactionAmount', 'Transaction amount is 50000 or more').isInt({
			min: 50000,
		}),
		check('transactionPayer', 'Transaction payer is required').not().notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const {
			otp,
			toAccountId,
			toFullName,
			transactionAmount,
			transactionPayer,
			transactionMessage,
		} = req.body

		const checkErrorsMongoose = {
			updateTransfererAccount: false,
			createTransfererTransaction: false,
			transfererTransactionFailed: false,
			updateReceiverAccount: false,
		}

		try {
			if (
				transactionPayer !== 'TRANSFERER' &&
				transactionPayer !== 'RECEIVER'
			) {
				return res.status(400).json({
					errors: [{ msg: 'Please include a valid transaction payer' }],
				})
			}

			const customer = await Customer.findById(req.user.id)
			if (!customer) {
				return res.status(400).json({
					errors: [{ msg: 'Customer not exists.' }],
				})
			}

			const fromFullName = customer.full_name

			if (customer.default_account_id === toAccountId) {
				return res.status(400).json({
					errors: [
						{ msg: 'Beneficiary account cannot coincide with debit account.' },
					],
				})
			}

			const accountTransferer = await Account.findOne({
				account_id: customer.default_account_id,
			})

			const accountReceiver = await Account.findOne({ account_id: toAccountId })

			if (!accountTransferer || !accountReceiver) {
				return res.status(400).json({
					errors: [
						{ msg: 'Account transferer or account receiver not exists.' },
					],
				})
			}

			if (accountTransferer.balance - transactionAmount < 50000) {
				return res.status(400).json({
					errors: [{ msg: 'Insufficient funds.' }],
				})
			}

			if (customer.OTP.is_used !== false) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP is only used once.',
						},
					],
				})
			}

			if (otp !== customer.OTP.code) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP code is invalid.',
						},
					],
				})
			}

			if (customer.OTP.expired_at < Date.now()) {
				return res.status(400).json({
					errors: [
						{
							msg: 'OTP code has expired.',
						},
					],
				})
			}

			const transactionTransferer = {
				entry_time: Date.now(),
				from_account_id: customer.default_account_id,
				from_fullname: fromFullName,
				to_account_id: toAccountId,
				to_fullname: toFullName,
				from_bank_id: 'EIGHT.Bank',
				to_bank_id: 'EIGHT.Bank',
				transaction_type: 'TRANSFER',
				transaction_payer: transactionPayer,
				transaction_message: transactionMessage || '',
				transaction_amount: transactionAmount,
				transaction_balance_before: accountTransferer.balance,
			}

			const transactionReceiver = new Transaction({
				entry_time: Date.now(),
				from_account_id: customer.default_account_id,
				from_fullname: fromFullName,
				to_account_id: toAccountId,
				to_fullname: toFullName,
				from_bank_id: 'EIGHT.Bank',
				to_bank_id: 'EIGHT.Bank',
				transaction_type: 'RECEIVE',
				transaction_payer: transactionPayer,
				transaction_message: transactionMessage || '',
				transaction_amount: transactionAmount,
				transaction_balance_before: accountReceiver.balance,
			})

			const accountTransfererResponse = await Account.findOneAndUpdate(
				{ account_id: customer.default_account_id },
				{
					$inc: {
						balance:
							transactionPayer === 'TRANSFERER'
								? -(transactionAmount + 1100)
								: -transactionAmount,
					},
				},
				{ new: true }
			)

			checkErrorsMongoose.updateTransfererAccount = {
				account_id: accountTransfererResponse.account_id,
				transaction_amount:
					transactionPayer === 'TRANSFERER'
						? -(transactionAmount + 1100)
						: -transactionAmount,
			}

			const transactionTransfererResponse = {
				...transactionTransferer,
				transaction_balance_after: accountTransfererResponse.balance,
				transaction_status: 'FAILED',
			}

			checkErrorsMongoose.transfererTransactionFailed = transactionTransfererResponse

			checkErrorsMongoose.createTransfererTransaction = {
				...transactionTransferer,
				transaction_balance_before: accountTransfererResponse.balance,
				transaction_balance_after: accountTransferer.balance,
				transaction_status: 'REFUND',
			}

			const accountReceiverResponse = await Account.findOneAndUpdate(
				{ account_id: toAccountId },
				{
					$inc: {
						balance:
							transactionPayer === 'TRANSFERER'
								? transactionAmount
								: transactionAmount - 1100,
					},
				},
				{ new: true }
			)

			checkErrorsMongoose.updateReceiverAccount = {
				account_id: accountReceiverResponse.account_id,
				transaction_amount:
					transactionPayer === 'TRANSFERER'
						? transactionAmount
						: transactionAmount - 1100,
			}

			const transactionReceiverResponse = await Transaction({
				...transactionReceiver._doc,
				transaction_balance_after: accountReceiverResponse.balance,
				transaction_status: 'FAILED',
			}).save()

			transactionTransfererResponse.transaction_status = 'SUCCESS'
			await new Transaction(transactionTransfererResponse).save()

			transactionReceiverResponse.transaction_status = 'SUCCESS'
			transactionReceiverResponse.save()

			customer.OTP.is_confirmed = true
			customer.OTP.is_used = true
			customer.save()

			const response = {
				msg: 'Transaction successfully transferred',
				data: {
					entry_time: transactionTransfererResponse.entry_time,
					from_account_id: transactionTransfererResponse.from_account_id,
					from_fullname: transactionTransfererResponse.from_fullname,
					to_account_id: transactionTransfererResponse.to_account_id,
					to_fullname: transactionTransfererResponse.to_fullname,
					transaction_type: transactionTransfererResponse.transaction_type,
					transaction_amount: transactionTransfererResponse.transaction_amount,
					transaction_balance_before:
						transactionTransfererResponse.transaction_balance_before,
					transaction_balance_after:
						transactionTransfererResponse.transaction_balance_after,
					transaction_status: transactionTransfererResponse.transaction_status,
				},
			}
			return res.status(200).json(response)
		} catch (error) {
			if (checkErrorsMongoose.updateReceiverAccount !== false) {
				await Account.findOneAndUpdate(
					{ account_id: checkErrorsMongoose.updateReceiverAccount.account_id },
					{
						$inc: {
							balance: -checkErrorsMongoose.updateReceiverAccount
								.transaction_amount,
						},
					},
					{ new: true }
				)
			}

			if (checkErrorsMongoose.updateTransfererAccount !== false) {
				await Account.findOneAndUpdate(
					{
						account_id: checkErrorsMongoose.updateTransfererAccount.account_id,
					},
					{
						$inc: {
							balance:
								checkErrorsMongoose.updateTransfererAccount.transaction_amount,
						},
					},
					{ new: true }
				)
			}

			if (checkErrorsMongoose.createTransfererTransaction !== false) {
				await new Transaction(
					checkErrorsMongoose.transfererTransactionFailed
				).save()
				await new Transaction(
					checkErrorsMongoose.createTransfererTransaction
				).save()
				return res.status(500).json({
					msg: 'Server error...',
				})
			}

			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)


// @route     GET /transactions/receiver-receiver-internal-banking
// @desc      Get full name from account id internal banking
// @access    Public
router.get('/receiver-internal-banking', auth, async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	try {
		const { accountId } = req.query

		const customer = await Customer.findOne({ default_account_id: accountId })

		if (!customer) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Customer not exists.',
					},
				],
			})
		}

		return res.status(200).json({ full_name: customer.full_name })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error...' })
	}
})

// @route     GET /transactions/receiver-interbank/
// @desc      Get full name from account id interbank
// @access    Public
router.get('/receiver-interbank', async (req, res) => {
	try {
		const partnerCode = req.headers['x_partner_code']
		if (!partnerCode) {
			return MakeResponse(req, res, {
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api.',
			})
		}

		const bankInfo = await LinkedBank.findOne({ partner_code: partnerCode })
		if (!bankInfo) {
			return MakeResponse(req, res, {
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api.',
			})
		}

		let digitalSignature = req.headers['x_signature']
		if (!digitalSignature) {
			return MakeResponse(req, res, {
				status: APIStatus.Forbidden,
				message: 'Require digital signature.',
			})
		}

		// Kiểm tra accountId mà ngân hàng đối tác gửi và kiểm tra accountId này có bị chỉnh sửa hay không ?
		const accountIdHashed = req.headers['x_account_id_hashed']
		let accountIdEncrypted = req.headers['x_account_id_encrypted']

		if (!accountIdHashed || !accountIdEncrypted) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Require account_id',
			})
		}

		let accountIdDecrypted = ''
		if (bankInfo.encrypt_type == 'RSA') {
			// eslint-disable-next-line no-undef
			const buffer = Buffer.from(accountIdEncrypted, 'base64')
			accountIdDecrypted = crypto
				.privateDecrypt(
					{
						key: bankInfo.our_private_key,
						padding: crypto.constants.RSA_PKCS1_PADDING,
					},
					buffer
				)
				.toString('utf-8')
			console.log('Account ID: ' + accountIdDecrypted)
		} else if (bankInfo.encrypt_type == 'PGP') {
			const {
				keys: [privateKey],
			} = await openpgp.key.readArmored(bankInfo.our_private_key)
			await privateKey.decrypt(bankInfo.passphrase)

			accountIdEncrypted = accountIdEncrypted.replace(/\\n/g, '\n')

			const { data: decrypted } = await openpgp.decrypt({
				message: await openpgp.message.readArmored(accountIdEncrypted), // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key))
					.keys, // for verification (optional)
				privateKeys: [privateKey], // for decryption
			})

			accountIdDecrypted = decrypted
			console.log('Account id: ' + accountIdDecrypted)
		}

		// Kiểm tra accountId có bị chỉnh sửa hay không
		if (
			accountIdHashed !=
			crypto
				.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key)
				.update(accountIdDecrypted)
				.digest('hex')
		) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'AccountId is invalid',
			})
		}

		// Kiểm tra chữ ký có hợp lệ hay không
		if (bankInfo.encrypt_type == 'RSA') {
			// eslint-disable-next-line no-undef
			const bufferAccountId = Buffer.from(accountIdDecrypted, 'base64')
			// eslint-disable-next-line no-undef
			const bufferSignature = Buffer.from(digitalSignature, 'base64')

			const check = crypto.verify(
				bankInfo.hash_algorithm,
				bufferAccountId,
				{
					key: bankInfo.partner_public_key,
					padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
				},
				bufferSignature
			)
			if (!check) {
				return MakeResponse(req, res, {
					status: APIStatus.Invalid,
					message: 'Signature is invalid',
				})
			}
		} else if (bankInfo.encrypt_type == 'PGP') {
			digitalSignature = digitalSignature.replace(/\\n/g, '\n')

			const verified = await openpgp.verify({
				message: await openpgp.cleartext.readArmored(digitalSignature), // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.partner_public_key))
					.keys, // for verification
			})

			console.log(digitalSignature)

			const { valid } = verified.signatures[0]
			if (!valid) {
				return MakeResponse(req, res, {
					status: APIStatus.Invalid,
					message: 'Signature is invalid',
				})
			}
		}

		// Kiểm tra thời gian mà ngân hàng đối tác gửi request nhằm để check request này còn hạn hay không và check entryTime này có bị chỉnh sửa hay không
		const entryTimeHashed = req.headers['x_entry_time_hashed']
		let entryTimeEncrypted = req.headers['x_entry_time_encrypted']

		if (!entryTimeHashed || !entryTimeEncrypted) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Require entry time',
			})
		}

		// Decrypt entryTime bằng private key
		let entryTimeDecrypted = ''
		if (bankInfo.encrypt_type == 'RSA') {
			// eslint-disable-next-line no-undef
			const buffer = Buffer.from(entryTimeEncrypted, 'base64')
			entryTimeDecrypted = crypto
				.privateDecrypt(
					{
						key: bankInfo.our_private_key,
						padding: crypto.constants.RSA_PKCS1_PADDING,
					},
					buffer
				)
				.toString('utf-8')
			console.log('Entry time: ' + entryTimeDecrypted)
		} else if (bankInfo.encrypt_type == 'PGP') {
			const {
				keys: [privateKey],
			} = await openpgp.key.readArmored(bankInfo.our_private_key)
			await privateKey.decrypt(bankInfo.passphrase)

			entryTimeEncrypted = entryTimeEncrypted.replace(/\\n/g, '\n')

			const { data: decrypted } = await openpgp.decrypt({
				message: await openpgp.message.readArmored(entryTimeEncrypted), // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key))
					.keys, // for verification (optional)
				privateKeys: [privateKey], // for decryption
			})

			entryTimeDecrypted = decrypted
			console.log('Entry time: ' + entryTimeDecrypted)
		}

		// Kiểm tra xem entryTime có hợp lệ hay không
		if (isNaN(entryTimeDecrypted)) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time must be an unix number',
			})
		}

		// Kiểm tra entryTime có bị chỉnh sửa hay không
		if (
			entryTimeHashed !=
			crypto
				.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key)
				.update(entryTimeDecrypted)
				.digest('hex')
		) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time is invalid',
			})
		}

		// Kiểm tra entryTime có bị "sớm" hơn thời điểm hiện tại hay không
		let currentTime = Math.round(new Date().getTime() / 1)
		if (entryTimeDecrypted > currentTime) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time is invalid (entrytime is greater than now)',
			})
		}

		// Kiểm tra entryTime có bị quá 5 phút kể từ thời điểm hiện tại hay không
		console.log("Current time: " + currentTime)
		if (currentTime - entryTimeDecrypted > 300000) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Your entrytime is expired. Please try again',
			})
		}

		const accessedApiHistoryResp = await DBModelInstance.Query(
			AccessedApiHistory,
			{
				bank_id: bankInfo.bank_id,
				accessed_api_type: 'GET_INFO',
				entry_time: entryTimeDecrypted,
				digital_signature: digitalSignature,
			}
		)
		if (accessedApiHistoryResp.status == APIStatus.Ok) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Your access is solved. Please make another request',
			})
		}

		const saveAccessedHistoryResponse = await DBModelInstance.Create(
			AccessedApiHistory,
			{
				bank_id: bankInfo.bank_id,
				accessed_api_type: 'GET_INFO',
				entry_time: entryTimeDecrypted,
				digital_signature: digitalSignature,
			}
		)

		if (saveAccessedHistoryResponse.status != APIStatus.Ok) {
			return MakeResponse(req, res, {
				status: APIStatus.Error,
				message: saveAccessedHistoryResponse.message,
			})
		}

		const queryCustomerResp = await DBModelInstance.Query(
			Customer,
			{ default_account_id: accountIdDecrypted },
			'full_name',
			0,
			1,
			false
		)

		return MakeResponse(req, res, queryCustomerResp)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			status: APIStatus.Error,
			message: err,
		})
	}
})

// @route     POST /transactions/transferring-interbank
// @desc      Transfer interbank
// @access    Private
router.post(
	'/transferring-interbank',
	[
		// auth,
		check('toAccountId', 'Receiver account is required').not().notEmpty(),
		check('toFullName', 'Receiver full name is required').not().notEmpty(),
		check('toBankId', 'Receiver bank ID is required').not().notEmpty(),
		check('transactionPayer', 'transactionPayer is required').not().notEmpty(),
		check('transactionAmount', 'Amount Transaction is 50000 or more').isInt({
			min: 50000,
		}),

	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).send(errors)
		}

		const {
			fromAccountId,
			toAccountId,
			toFullName,
			toBankId,
			transactionAmount,
			transactionPayer,
			transactionMessage
		} = req.body

		try {

			if (
				transactionPayer !== 'TRANSFERER' &&
				transactionPayer !== 'RECEIVER'
			) {
				return res.status(400).json({
					errors: [{ msg: 'Please include a valid transaction payer' }],
				})
			}

			const findCustomerResp = await DBModelInstance.Query(Customer,{
				default_account_id: fromAccountId
			},null,0,1,false)

			if (findCustomerResp.status != APIStatus.Ok) {
				return res.status(404).json({
					errors: [
						{
							msg: 'Customer not exists.',
						},
					],
				})
			}

			const fromFullName = findCustomerResp.data[0].full_name

			const account = await Account.findOne({ account_id: fromAccountId })

			if (!account) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Account not exists.',
						},
					],
				})
			}

			let realTransactionAmount = transactionAmount

			if (transactionPayer == "TRANSFERER") {
				realTransactionAmount = realTransactionAmount + 5000
			}

			if (account.balance - realTransactionAmount < 50000) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Insufficient funds.',
						},
					],
				})
			}

	
			const transactionTransferer = new Transaction({
				entry_time: Date.now(),
				from_account_id: fromAccountId,
				from_fullname: fromFullName,
				to_account_id: toAccountId,
				to_fullname: toFullName,
				from_bank_id: 'EIGHT.Bank',
				to_bank_id: toBankId,
				transaction_type: 'TRANSFER',
				transaction_amount: transactionAmount,
				transaction_balance_before: account.balance,
				transaction_balance_after: account.balance - transactionAmount,
				transaction_message: transactionMessage,
				transaction_payer: transactionPayer,
				transaction_status: "SUCCESS"
			})

			// Kiểm tra ngân hàng người nhận có đúng mã id
			// ...
			let result = await DBModelInstance.Query(PartnerBank,{
				bank_id: toBankId
			},null,0,1,false)

			if (result.status != APIStatus.Ok) {
				return res.status(404).json({
					errors: [
						{
							msg: 'Not found any matched bankId',
						},
					],
				})
			}

			let allowToDoAction = false

			if (result.data[0].encrypt_type == "PGP") {
				if (result.data[0].bank_id == "BaoSonBank") {
					const { keys: [privateKey] } = await openpgp.key.readArmored(result.data[0].our_private_key)
					await privateKey.decrypt("123456");
					const { data: cleartext } = await openpgp.sign({
						message: openpgp.cleartext.fromText("NHÓM 6"), // CleartextMessage or Message object
						privateKeys: [privateKey]                     // for signing
					});

					let data = {
						Id: toAccountId,
						ToName: toFullName,
						Amount: transactionAmount,
						Content: transactionMessage,
						Fromaccount: fromAccountId,
						FromName:	fromFullName 
					};

					let response = await BaoSonClient.makeHTTPRequest("POST",{
						nameBank: 'Eight Bank',
						ts: moment().unix(),
						sig: hash(moment().unix() + data + "secretkey"),
						sigpgp: JSON.stringify(cleartext)
					},{},data,"/transfers",null)

					let sign = ""
					if (response.status && response.status == 200) {
						sign = response.data.sign
					}

					if (sign != "") {
						const verified = await openpgp.verify({
							message: await openpgp.cleartext.readArmored(sign), // parse armored message
							publicKeys: (
								await openpgp.key.readArmored(result.data[0].partner_public_key)
							).keys, // for verification
						})
						const { valid } = verified.signatures[0]
						if (!valid) {
							return res.status(500).json({
								errors: [
									{
										msg: 'Signature from partner is wrong',
									},
								],
							})
						} else {
							allowToDoAction = true
						}
					} else {
						return res.status(500).json({
							errors: [
								{
									msg: 'Signature from partner is wrong',
								},
							],
						})
					}
				}
			} else if (result.data[0].encrypt_type == "RSA") {
				if (result.data[0].bank_id == "S2Q") {
					let timestamp = moment().unix()
					let securityKey = result.data[0].secret_key
					let feePayBySender = false
					if (transactionPayer == "TRANSFERER") {
						feePayBySender = true
					}

					let data = {
						source_account: fromAccountId,
						destination_account: toAccountId,
						source_bank: 'Eight',
						description: transactionMessage,
						feePayBySender,
						fee: 5000,
						amount: transactionAmount
					}

					let _data = JSON.stringify(data)

					let privateKey = result.data[0].our_private_key.replace(/\\n/g, '\n');
					let signer = crypto.createSign('sha256');
					signer.update(_data);
					let signature = signer.sign(privateKey, 'hex');

					let response= await S2QClient.makeHTTPRequest("POST",{
						timestamp,
						security_key:securityKey,
						hash: crypto.createHash('sha256').update(timestamp + _data + securityKey).digest('hex')
					},{},{
						data,
						signature
					},"/public/transfer",null)

					let sign = ""
					if (response.status && response.status == 200) {
						sign = response.data.signature
					}

					if (sign != "") {
						allowToDoAction = true
					} else {
						return res.status(500).json({
							errors: [
								{
									msg: 'Signature from partner is wrong',
								},
							],
						})
					}

					console.log(response.data)

				}
			}

			if (allowToDoAction) {
				const accountTransfererResponse = await Account.findOneAndUpdate(
					{ account_id: fromAccountId },
					{ $inc: { balance: -realTransactionAmount } },
					{
						new: true,
					}
				)
				const transactionTransfererResponse = await transactionTransferer.save()
				return res
				.status(200)
				.json({ transactionTransfererResponse, accountTransfererResponse })
			} else {
				return res.status(500).json({
					errors: [
						{
							msg: 'Something error',
						},
					],
				})
			}

			
		} catch (error) {
			return res.status(500).json({ msg: 'Server error...' })
		}
	}
)

// @route     GET /transactions/transferring-interbank
// @desc      Get infomation from accountId in another bank
// @access    Private
router.get("/transferring-interbank",async (req,res) => {
	try {

		const accountId = req.query.accountId
		const bankId = req.query.bankId

		if (!accountId || !bankId) {
			return MakeResponse(req,res,{
				status: APIStatus.Invalid,
				message: "Require accountId and bankId"
			})
		}

		let result = await DBModelInstance.Query(PartnerBank, {
			bank_id: bankId
		},null,0,1,false)

		if (result.status != APIStatus.Ok) {
			return MakeResponse(req,res,result)
		}

		if (result.data[0].encrypt_type == "RSA") {
			let timestamp = moment().unix()
			let securityKey = result.data[0].secret_key
			let data = JSON.stringify(accountId)

			if (result.data[0].bank_id == "S2Q") {
				let response = await S2QClient.makeHTTPRequest("GET",{
					timestamp,
					security_key:securityKey,
					hash: crypto.createHash('sha256').update(timestamp + data + securityKey).digest('hex')
				},{},{},`/public/${accountId}`,null)

				if (response && response.status && response.status == 200) {
					return res.status(200).json({
						fullName: response.data.full_name
					})
				} else {
					return res.status(500).json({
						errors: [
							{
								msg: 'Call to partner bank fail',
							},
						],
					})
				}
				
			}
		} else if (result.data[0].encrypt_type == "PGP") {
			let timestamp = moment().unix()
			if (result.data[0].bank_id == "BaoSonBank") {
				let response = await BaoSonClient.makeHTTPRequest("POST", {
					nameBank: "Eight Bank",
					ts:timestamp,
					sig: hash(moment().unix() + accountId + result.data[0].secret_key)
				},{},{
					Id: accountId
				},"/detail",null)


				if (response && response.status && response.status == 200) {
					return res.status(200).json({
						fullName: response.data.result.Fullname
					})
				} else {
					return res.status(500).json({
						errors: [
							{
								msg: 'Call to partner bank fail',
							},
						],
					})
				}
			}
		}

		return MakeResponse(res,req,{
			status: APIStatus.Ok,
			message: "Ok"
		})
	} catch (error) {
		return res.status(500).json({ msg: 'Server error...' })
	}
})


// @route     POST /transactions/receiving-interbank
// @desc      Receive transferring interbank
// @access    Public
router.post(
	'/receiving-interbank',
	[
		// check('entryTime', 'Entry time is required').not().notEmpty(),
		// check('toAccountId', 'Receiver account is required').not().notEmpty(),
		// check('toFullName', 'Receiver full name is required').not().notEmpty(),
		// check('fromAccountId', 'Transferer account is required').not().notEmpty(),
		// check('fromFullName', 'Transferer full name is required').not().notEmpty(),
		// check('fromBankId', 'Transferer bank ID is required').not().notEmpty(),
		// check('transactionAmount', 'Amount Transaction is 50000 or more').isAfter('49999')
	],
	async (req, res) => {
		try {
			const partnerCode = req.headers['x_partner_code']
			if (!partnerCode) {
				return MakeResponse(req, res, {
					status: APIStatus.Unauthorized,
					message: 'Not allow to access this api.',
				})
			}

			const bankInfo = await LinkedBank.findOne({ partner_code: partnerCode })
			if (!bankInfo) {
				return MakeResponse(req, res, {
					status: APIStatus.Unauthorized,
					message: 'Not allow to access this api.',
				})
			}

			// const {
			// 	data,
			// 	data_hashed,
			// 	digital_sign
			// } = req.body

			// decrypt body data
			let dataDecryptedObject = ''
			if (bankInfo.encrypt_type == 'RSA') {
				// eslint-disable-next-line no-undef
				const buffer = Buffer.from(req.body.data, 'base64')
				const dataDecryptedStr = crypto
					.privateDecrypt(
						{
							key: bankInfo.our_private_key,
							padding: crypto.constants.RSA_PKCS1_PADDING,
						},
						buffer
					)
					.toString('utf-8')
				dataDecryptedObject = JSON.parse(dataDecryptedStr)
			} else if (bankInfo.encrypt_type == 'PGP') {
				const {
					keys: [privateKey],
				} = await openpgp.key.readArmored(bankInfo.our_private_key)
				await privateKey.decrypt(bankInfo.passphrase)

				const { data: decrypted } = await openpgp.decrypt({
					message: await openpgp.message.readArmored(req.body.data), // parse armored message
					publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key))
						.keys, // for verification (optional)
					privateKeys: [privateKey], // for decryption
				})

				dataDecryptedObject = JSON.parse(decrypted)
			}

			// Kiểm tra xem entryTime có hợp lệ hay không
			if (isNaN(dataDecryptedObject.entryTime)) {
				return MakeResponse(req, res, {
					status: APIStatus.Invalid,
					message: 'Entry time must be an unix number.',
				})
			}

			// Kiểm tra entryTime có bị "sớm" hơn thời điểm hiện tại hay không
			let currentTime = Math.round(new Date().getTime() / 1)
			if (dataDecryptedObject.entryTime > currentTime) {
				return MakeResponse(req, res, {
					status: APIStatus.Invalid,
					message: 'Entry time is invalid (entrytime is greater than now).',
				})
			}

			// Kiểm tra entryTime có bị quá 5 phút kể từ thời điểm hiện tại hay không
			if (currentTime - dataDecryptedObject.entryTime > 300000) {
				return MakeResponse(req, res, {
					status: APIStatus.Invalid,
					message: 'Your entrytime is expired. Please try again.',
				})
			}

			// Kiểm tra request này có quá hạn hay không
			const accessedApiHistoryResp = await DBModelInstance.Query(
				AccessedApiHistory,
				{
					bank_id: bankInfo.bank_id,
					accessed_api_type: 'TRANSFER',
					entry_time: dataDecryptedObject.entryTime,
					digital_signature: req.body.digital_sign,
				}
			)
			if (accessedApiHistoryResp.status == APIStatus.Ok) {
				return MakeResponse(req, res, {
					status: APIStatus.Invalid,
					message: 'Your access is solved. Please make another request.',
				})
			}

			// Kiểm tra gói tin có bị chỉnh sửa hay không
			if (
				req.body.data_hashed !=
				crypto
					.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key)
					.update(JSON.stringify(dataDecryptedObject))
					.digest('hex')
			) {
				return MakeResponse(req, res, {
					status: APIStatus.Invalid,
					message: 'Your data is invalid.',
				})
			}

			// Kiểm tra chữ ký bất đối xứng
			if (bankInfo.encrypt_type == 'RSA') {
				// eslint-disable-next-line no-undef
				const bufferBodyData = Buffer.from(
					JSON.stringify(dataDecryptedObject),
					'base64'
				)
				// eslint-disable-next-line no-undef
				const bufferSignature = Buffer.from(req.body.digital_sign, 'base64')
				const check = crypto.verify(
					bankInfo.hash_algorithm,
					bufferBodyData,
					{
						key: bankInfo.partner_public_key,
						padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
					},
					bufferSignature
				)
				if (!check) {
					return MakeResponse(req, res, {
						status: APIStatus.Invalid,
						message: 'Signature is invalid.',
					})
				}
			} else if (bankInfo.encrypt_type == 'PGP') {
				req.body.digital_sign =
					'-----BEGIN PGP SIGNED MESSAGE-----\n' +
					'Hash: SHA512\n\n' +
					JSON.stringify(dataDecryptedObject) +
					'\n' +
					req.body.digital_sign
				req.body.digital_sign = req.body.digital_sign.replace(/\\n/g, '\n')
				const verified = await openpgp.verify({
					message: await openpgp.cleartext.readArmored(req.body.digital_sign), // parse armored message
					publicKeys: (
						await openpgp.key.readArmored(bankInfo.partner_public_key)
					).keys, // for verification
				})
				const { valid } = verified.signatures[0]
				if (!valid) {
					return MakeResponse(req, res, {
						stauts: APIStatus.Invalid,
						message: 'Signature is invalid.',
					})
				}
			}

			const saveAccessedHistoryResponse = await DBModelInstance.Create(
				AccessedApiHistory,
				{
					bank_id: bankInfo.bank_id,
					accessed_api_type: 'TRANSFER',
					entry_time: dataDecryptedObject.entryTime,
					digital_signature: req.body.digital_sign,
				}
			)

			if (saveAccessedHistoryResponse.status != APIStatus.Ok) {
				return MakeResponse(req, res, {
					status: APIStatus.Error,
					message: saveAccessedHistoryResponse.message,
				})
			}

			const account = await Account.findOne({
				account_id: dataDecryptedObject.toAccountId,
			})

			if (!account) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Account not exists.',
						},
					],
				})
			}

			const transactionReceiver = new Transaction({
				entry_time: dataDecryptedObject.entryTime,
				from_account_id: dataDecryptedObject.fromAccountId,
				from_fullname: dataDecryptedObject.fromFullName,
				to_account_id: dataDecryptedObject.toAccountId,
				to_fullname: dataDecryptedObject.toFullName,
				from_bank_id: bankInfo.bank_id,
				to_bank_id: 'EIGHT.Bank',
				transaction_type: 'RECEIVE',
				transaction_amount: dataDecryptedObject.transactionAmount,
				transaction_balance_before: account.balance,
				transaction_balance_after:
					Number(account.balance) +
					Number(dataDecryptedObject.transactionAmount),
			})

			const accountReceiverResponse = await Account.findOneAndUpdate(
				{ account_id: dataDecryptedObject.toAccountId },
				{ $inc: { balance: dataDecryptedObject.transactionAmount } },
				{
					new: true,
				}
			)

			const transactionReceiverResponse = await transactionReceiver.save()

			let response = {
				transactionReceiverResponse,
				accountReceiverResponse,
			}

			if (bankInfo.encrypt_type == 'PGP') {
				const {
					keys: [privateKey],
				} = await openpgp.key.readArmored(bankInfo.our_private_key)
				await privateKey.decrypt(bankInfo.passphrase)
				let { data: digital_sign } = await openpgp.sign({
					message: openpgp.cleartext.fromText(JSON.stringify(response)), // CleartextMessage or Message object
					privateKeys: [privateKey], // for signing
				})
				response.digital_sign = digital_sign
			} else if (bankInfo.encrypt_type == 'RSA') {
				let digital_sign = crypto.sign(
					'SHA1',
					// eslint-disable-next-line no-undef
					Buffer.from(JSON.stringify(response), 'base64'),
					{
						key: bankInfo.our_private_key,
						padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
					}
				)

				digital_sign = digital_sign.toString('base64')
				response.digital_sign = digital_sign
			}
			return res.status(200).json({
				status: 'OK',
				data: response,
			})
		} catch (error) {
			return res.status(500).json({ msg: error.toString() })
		}
	}
)

module.exports = router
