const express = require('express')

const router = express.Router()
const { check, validationResult } = require('express-validator')
// const NodeRSA = require('node-rsa')
const authCustomer = require('../../middleware/authCustomer')
const crypto = require('crypto')
const openpgp = require('openpgp')

const { MakeResponse, APIStatus } = require('../../utils/APIStatus.js')

const Account = require('../../models/Account')
const Customer = require('../../models/Customer')
const Transaction = require('../../models/Transaction')
const LinkedBank = require('../../models/LinkedBank')
const AccessedApiHistory = require('../../models/AccessedApiHistory')
const DBModel = require('../../utils/DBModel')


const DBModelInstance = new DBModel()

// @route     POST /transactions/transfering-within-bank
// @desc      Chuyển khoản trong ngân hàng
// @access    Public
router.post('/transfering-within-bank', [
	authCustomer,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('fromAccountId', 'Transferer account is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toFullName', 'Receiver full name is required').not().notEmpty(),
	check('transactionAmount', 'Amount Transaction is 50000 or more').isInt({ min: 50000 })
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		entryTime,
		fromAccountId,
		toAccountId,
		toFullName,
		transactionAmount
	} = req.body

	const checkErrorsMongoose = {
		updateTransfererAccount: false,
		createTransfererTransaction: false,
		updateReceiverAccount: false
	}

	try {
		const customer = await Customer.findById(req.user.id)

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const fromFullName = customer.full_name
		const listAccountId = [...customer.saving_account_id, customer.default_account_id]

		if (listAccountId.indexOf(fromAccountId) === -1) {
			return res.status(400).json({
				errors: [{
					msg: 'Transfering account id is not account\'s customer'
				}]
			})
		}

		if (fromAccountId === toAccountId) {
			return res.status(400).json({
				errors: [{
					msg: 'Beneficiary account cannot coincide with debit account'
				}]
			})
		}

		const accountTransferer = await Account.findOne({ account_id: fromAccountId })

		const accountReceiver = await Account.findOne({ account_id: toAccountId })

		if (!accountTransferer || !accountReceiver) {
			return res.status(400).json({
				errors: [{
					msg: 'Account transferer or account receiver not exists'
				}]
			})
		}

		if (accountTransferer.balance - transactionAmount < 50000) {
			return res.status(400).json({
				errors: [{
					msg: 'Insufficient funds'
				}]
			})
		}

		const transactionTransferer = {
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_fullname: fromFullName,
			to_account_id: toAccountId,
			to_fullname: toFullName,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			transaction_type: 'TRANSFER',
			transaction_amount: transactionAmount,
			transaction_balance_before: accountTransferer.balance
		}

		const transactionReceiver = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_fullname: fromFullName,
			to_account_id: toAccountId,
			to_fullname: toFullName,
			from_bank_id: 'EIGHT',
			to_bank_id: 'EIGHT',
			transaction_type: 'RECEIVE',
			transaction_amount: transactionAmount,
			transaction_balance_before: accountReceiver.balance,
		})

		const accountTransfererResponse = await Account.findOneAndUpdate(
			{ account_id: fromAccountId },
			{ $inc: { balance: -transactionAmount } },
			{ new: true }
		)

		checkErrorsMongoose.updateTransfererAccount = { account_id: accountTransfererResponse.account_id, transaction_amount: transactionAmount }

		const transactionTransfererResponse = await new Transaction({
			...transactionTransferer,
			transaction_balance_after: accountTransfererResponse.balance,
			transaction_status: 'FAILED'
		}).save()

		checkErrorsMongoose.createTransfererTransaction = {
			...transactionTransferer,
			transaction_balance_before: accountTransfererResponse.balance,
			transaction_balance_after: accountTransferer.balance,
			transaction_status: 'REFUND'
		}

		const accountReceiverResponse = await Account.findOneAndUpdate(
			{ account_id: toAccountId },
			{ $inc: { balance: transactionAmount } },
			{ new: true }
		)

		checkErrorsMongoose.updateReceiverAccount = { account_id: accountReceiverResponse.account_id, transaction_amount: transactionAmount }

		const transactionReceiverResponse = await Transaction({
			...transactionReceiver._doc,
			transaction_balance_after: accountReceiverResponse.balance,
			transaction_status: 'FAILED'
		}).save()

		transactionTransfererResponse.transaction_status = 'SUCCESS'
		transactionTransfererResponse.save()

		transactionReceiverResponse.transaction_status = 'SUCCESS'
		transactionReceiverResponse.save()

		return res.status(200).json({
			transactionTransfererResponse, transactionReceiverResponse, accountTransfererResponse, accountReceiverResponse
		})
	} catch (error) {
		if (checkErrorsMongoose.updateReceiverAccount !== false) {
			await Account.findOneAndUpdate(
				{ account_id: checkErrorsMongoose.updateReceiverAccount.account_id },
				{ $inc: { balance: -checkErrorsMongoose.updateReceiverAccount.transaction_amount } },
				{ new: true }
			)
		}

		if (checkErrorsMongoose.updateTransfererAccount !== false) {
			await Account.findOneAndUpdate(
				{ account_id: checkErrorsMongoose.updateTransfererAccount.account_id },
				{ $inc: { balance: checkErrorsMongoose.updateTransfererAccount.transaction_amount } },
				{ new: true }
			)
		}

		if (checkErrorsMongoose.createTransfererTransaction !== false) {
			await new Transaction(checkErrorsMongoose.createTransfererTransaction).save()
		}

		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /transactions/receiver-withinbank/:accountId
// @desc      Lấy họ và tên người nhận khi chuyển khoản cùng ngân hàng
// @access    Public
router.get('/receiver-withinbank/:accountId', authCustomer, async (req, res) => {
	try {
		const { accountId } = req.params

		const customer = await Customer.findOne({ default_account_id: accountId })

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const fullName = customer.full_name

		return res.status(200).json({ full_name: fullName })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     GET /transactions/receiver-interbank/
// @desc      Lấy họ và tên người nhận khi ngân hàng khác muốn chuyển khoản
// @access    Public
router.get('/receiver-interbank', async (req, res) => {
	// Kiểm tra ngân hàng đã được liên kết chưa. Ý tưởng: check ip nơi gọi xem đã có trong db chưa. Do các nhóm kia chưa deploy nên tạm pass bước này
	// const bankInfo = await LinkedBank.findOne({ bank_host: 'localhost2' })
	// if (!bankInfo) {
	// 	return MakeResponse(req, res, {
	// 		status: APIStatus.Unauthorized,
	// 		message: 'Not allow to see info'
	// 	})
	// }

	// Kiểm tra ngân hàng đã được liên kết hay chưa ?. Ý tưởng: cung cấp cho các ngân hàng access_token để gọi api.
	// nếu access token tồn tại thì tiếp tục verify chữ ký bất đối xứng của ngân hàng đó.

	const accessToken = req.headers['x_access_token']
	if (!accessToken) {
		return MakeResponse(req,res,{
			status: APIStatus.Unauthorized,
			message: 'Not allow to access this api'
		})
	}

	const bankInfo = await LinkedBank.findOne({access_token: accessToken})
	if (!bankInfo) {
		return MakeResponse(req,res,{
			status: APIStatus.Unauthorized,
			message: 'Not allow to access this api'
		})
	}

	let digitalSignature = req.headers['x_siginature']
	if (!digitalSignature) {
		return MakeResponse(req,res,{
			status: APIStatus.Forbidden,
			message: 'Require digital signature'
		})
	}

	// Kiểm tra accountId mà ngân hàng đối tác gửi và kiểm tra accountId này có bị chỉnh sửa hay không ?
	const accountIdHashed = req.headers['x_account_id_hashed']
	let accountIdEncrypted = req.headers['x_account_id_encrypted']

	if (!accountIdHashed || !accountIdEncrypted) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'Require account_id'
		})
	}


	let accountIdDecrypted = ''
	if (bankInfo.encrypt_type == 'RSA') {
		// eslint-disable-next-line no-undef
		const buffer = Buffer.from(accountIdEncrypted, 'base64')
		accountIdDecrypted = crypto.privateDecrypt({ key: bankInfo.our_private_key, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf-8')
		console.log('Account ID: ' + accountIdDecrypted)
	} else if (bankInfo.encrypt_type == 'PGP') {
		const { keys: [privateKey] } = await openpgp.key.readArmored(bankInfo.our_private_key)
		await privateKey.decrypt(bankInfo.passphrase)

		accountIdEncrypted = accountIdEncrypted.replace(/\\n/g, '\n')

		const { data: decrypted } = await openpgp.decrypt({
			message: await openpgp.message.readArmored(accountIdEncrypted),             // parse armored message
			publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key)).keys, // for verification (optional)
			privateKeys: [privateKey]                                           // for decryption
		})

		accountIdDecrypted = decrypted
		console.log('Account id: ' + accountIdDecrypted)
	}


	// Kiểm tra accountId có bị chỉnh sửa hay không 
	if (accountIdHashed != crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(accountIdDecrypted).digest('hex')) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'AccountId is invalid'
		})
	}


	// let partnerPrivatekey = `-----BEGIN RSA PRIVATE KEY-----\n`+
	// `MIICXAIBAAKBgQDGN9r1zuUtToPbjItJZumAGpz9M8HRk9RjPS/JRl1uEDqL92Xb\n`+
	// `n32484PU9iD4N4oKLHibo/Pb8lm/A2E0uxIVyxEqG2QcpXXb5jAgYwm8avj8zjUO\n`+
	// `acZyXnN7NjnrfnuYlPoDO4t7aVTFx3A6jcGeGH9+thUleHAR7ZMOiPOJjQIDAQAB\n`+
	// `AoGAMBANHLs9IL5ABLVQdMzqY3CQjmjFX178CdAlTSWts+lleNjVLuq+XmFVnwbL\n`+
	// `OcSlyQ+9cufPUo6yKjnUkSenG4pxTS5Wb9yw3HMkFU2HnWWefq2dMzHelcXNe96V\n`+
	// `n4dHVJBA0mjyOOvLsww5hwQrz9HqrO+zKHWp4yt0UsJehVUCQQDjX/aREF6ukxDO\n`+
	// `M+A88diBYLpDUzmPGKGD7L69H5XDcA6FfcsmxnFdgHG/g17lYgX/jXzPzDedr7j1\n`+
	// `XOqiyUVPAkEA3yw0j6IlHPEMVpApwzJoec+btU0TvtxpNp8htKL1t9dtQ1H399OO\n`+
	// `Z1KhlaInO7+HH0S7vE0ltbm+xxW9dk+EYwJBAL4Oz+6QDWTFf42tZSnsSjpTHT77\n`+
	// `iShowVGiCgnSJgB4YVsKPE7MH6S1od8gs6jvl+32WbbkkDSZ1vQZ1/N8ZBcCQBFJ\n`+
	// `5mR+JivgzJjkICgb/pX5LFHWP8JYZtoxZ7YLrcdpK/C8J96OCAkfEJ976VgqlTgp\n`+
	// `5fVHcLVsR0g6+etxa4sCQGHQ7VrDBjDzYrf59adTgiuhGze2+1XNpO3i4eCWXKUI\n`+
	// `KRV0iO23xwivUezWc21ZlrtlMpYm1fBE3ilpY5GJqAI=\n`+
	// `-----END RSA PRIVATE KEY-----`
	// let bufferTest = crypto.sign(
	// 	'SHA1',
	// 	Buffer.from(accountIdDecrypted,'base64'),
	// 	{ key: partnerPrivatekey, padding: crypto.constants.RSA_PKCS1_PADDING }
	// )
	
	// console.log(bufferTest.toString('base64'))

	// Kiểm tra chữ ký có hợp lệ hay không
	if (bankInfo.encrypt_type == 'RSA') {
		// eslint-disable-next-line no-undef
		const bufferAccountId = Buffer.from(accountIdDecrypted, 'base64')
		// eslint-disable-next-line no-undef
		const bufferSignature = Buffer.from(digitalSignature,'base64')
		const check = crypto.verify(
			bankInfo.hash_algorithm,
			bufferAccountId,
			{
				key: bankInfo.partner_public_key,
				padding: crypto.constants.RSA_PKCS1_PADDING
			},
			//bufferTest
			bufferSignature
		)
		if (!check) {
			return MakeResponse(req,res,{
				status: APIStatus.Invalid,
				message: 'Signature is invalid'
			})
		}
	} else if (bankInfo.encrypt_type == 'PGP') {

		// đoạn này lưu lại để hướng dẫn mấy nhóm khác tạo chữ ký
		// let partnerPrivateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n` +
		// `Version: Keybase OpenPGP v1.0.0\n`+
		// `Comment: https://keybase.io/crypto\n\n`+
		// `xcFGBF7IIyUBBACht5jrxjfRuGffvtvKDh2GF/Ze2wulKvRCvYKq5skU5ekPfIxH\n`+
		// `KRTj1OAZM0lmOtmL4NGo6oSPCcSC8VjMzQUZUJ6g1OVDanbQbGu89lGbXid6mC0T\n`+
		// `Jk2SoPL+VhGAej74fsB+Ficgvw1MikH6dFiiOietTrrMMPydgI+3Fpyx3wARAQAB\n`+
		// `/gkDCNovwRGZ5S3pYJ2tox7JYXbAJQKgVcouVnFfrPhoF2XI5BdWuLos03WPmJec\n`+
		// `5t8yGqsqDb29B8zImjSiJ+YVakRMyF9uNCFWOz4Tp0ekdkVXR61HD+D6mj8MH+/V\n`+
		// `yubGCSlyNFUwfKE9/FqRWGLhoqaEuZo7uCDmEnrJNgkyWUUC6jdFJx+9VSh+oylJ\n`+
		// `qNrRGuAu3NsUKks9M8haYxo2ABqe9RskmJKb1D6L0fNdXT+r8gxSPNVXRg9KGn19\n`+
		// `euiyzQtN4RD72FxFrcVQZQ663gX/5PK0kOD44bB7RcVd1Ro1EBKk9oCNbpOs58WA\n`+
		// `l7T0+0RhlCdsw02imopvEW77yfFOcJebUMDWwhxr9N3CagK7+HjePxl9yrYBg053\n`+
		// `Yjq1ihyDYezaDJxWQqn8wGERWlns1hZE/UdJT0lPJjdzp/snHk2QSmofMk6rpbX4\n`+
		// `JSXs84QJ3RNkHqAkIbCODPHi55DwUOV+Zd/HncM2H0JWbU9RX7X3hODNJ0zDqiBI\n`+
		// `b8OgbmcgU2FuZyA8bGhzYW5naGNtdXNAZ21haWwuY29tPsKtBBMBCgAXBQJeyCMl\n`+
		// `AhsvAwsJBwMVCggCHgECF4AACgkQ/KSLLwtRtUw1zAP9Eh0tsM95bmifyaZCrcbS\n`+
		// `xg9iFgWs4lq7m1aWv8ELwSQh1Fm63B28sWw2Mrq9cMyRAAoP6S973lVj1+f18Evt\n`+
		// `6jdGdJK870uqCuTVvUgUsUoAbwORY/1Hbb4fdb2k1Da3LJo/XeLr41vZw3OYahn5\n`+
		// `nvIOi/pLjbtrmCIs96KD1zvHwUYEXsgjJQEEAMUDxzfr45Ad6XblCzZyHrhYFmUc\n`+
		// `2ZiLyYaidXLgvRxEDFjriYFV0Gmq/CLdUd2oS6bKDg5+BhZOZ9+acX6X2OixonGA\n`+
		// `u+Bk/aVdPsQgyoOoHTJ3Q38b/dyif+c7RKnXWAKWww1suMEHy5AYtDO9vvB9G36M\n`+
		// `A0wRyvPm48YFbNhLABEBAAH+CQMI/rORlxGW14dgfS/KZpSWO3d5zhJsgo+bmnyP\n`+
		// `mS2wg6nbjEfXkjuouf1v7O3TMcCIjhbHjXN/ea8XQL6tMExh/8MlUFEjx0WDl3ce\n`+
		// `5aJi+4gF+tn0pdD/yfkBOBBHMcAOPleVAgVtNjmwTtkINu8vlQA4+RzQTWa8Eq/i\n`+
		// `x8Beqb3WU+4k0Cq5wP8/+Z6UMUDyO5S41fc/ySpg7BBFLhK8A/MVustWZVopvYiE\n`+
		// `2qmwW8MkAiG9SPCbL8tmhGQ7HY8CG4b2lRBEcbnKgYoDEU5CEl8wTmx274Asjn1V\n`+
		// `GrfwRKTnmnouzcWsZUt/luvg3vIAoshR/QqeYrxuH8fPY/8BjutiQ4Ggl9H2IsrB\n`+
		// `HZ672F0QhoqHgZObAk/Zu8bOlsJglHlbuTCWH+260qFLJOTDGhGdLCI7ksuhdsnn\n`+
		// `cgfnvJ0LtiCu1wGHuT1UkgmpDEBTPSwjpiyO0AN8Ab2kgnOedLUaWsKfoe+kC+Dc\n`+
		// `X8me271ELOtYXsLAgwQYAQoADwUCXsgjJQUJDwmcAAIbLgCoCRD8pIsvC1G1TJ0g\n`+
		// `BBkBCgAGBQJeyCMlAAoJEJUvc0gDY8k9hmoD+gIJOZvc1h1BN/cYw60jeFySu0Yu\n`+
		// `NvTaczUtw5ILklXpg+aBCY9kplv+/QmX9gGeUrBPxoyLdyVYfaCSK3CCwO48h0ol\n`+
		// `4HB0KZXKHkVmIJKUQXhA1b0yXCXDEV55NkZkVjJDEdC8t51GFClQ9YUTSUDDJn4x\n`+
		// `NuNBIkQqhMzqwBx3u90EAIuNOb/C8xCsSbWIgc2yQTHogWeD9TQD0XNpXYr5jg/w\n`+
		// `NdbRrScNSvHTsvn7iyRV9HESW2PCmibsaemvZCOdIksbAorS1ZUOJfkVETNSUKR9\n`+
		// `EaiMEl3sQxp472LcEBWhhU9lpN+iO9KhtnNnzRqT4bN9bDheji4Ps1VwwfYdH7pa\n`+
		// `x8FGBF7IIyUBBACbAhV+D7t4d77JlhzwSmTDldipX3gc0BEnF1Q8vv3sTElx2zh3\n`+
		// `P7kMmsNVbc8G9b9MQ9t81OHKWXEFekBB7WmeZbkY9FEe3PxYDwBZoisjzu6J0zOU\n`+
		// `xQHYeHHWycFBN97gb8KcdraL2Defpb3S4FxNLuCIoy5c04z2CnwSEJuKxQARAQAB\n`+
		// `/gkDCKdUUCO4HiDnYCQVWPBTlPrBxO8hci6WpoE4JyAd0emgo5PKe4HQmt5OSny7\n`+
		// `itIaFZX277dbDorvr+E2E8Q3dw+P50EMYfKgan54rWOq2Fx4FrYPx6wYuw4xQTo3\n`+
		// `/kKxMc3/vhXD8zpZsw+CXDVZ/iaNnr6JQwQeNFR9KgYPZjdCIQoRfzruN4qv/ItZ\n`+
		// `UvckNyyKpt6FGgNP1rqfvndllmIjsmimReghNz3OGalwPxsoNOJ8RbBkfjcKj+Nk\n`+
		// `vgzwEBAzit4cnNotQ2kM2HU2BkDrshUJdZikIqKkSP5C/5gJUjDQGtuXKVR6D6Tp\n`+
		// `pSevTPYWTwg+dnJ1Iu76lke7fyLXP9e3JA1W5a9A8Npc12I/jILAqxLroXgBazUl\n`+
		// `vpFGh05vlDYLwEih7hENRIYI0X0qr1q0i6CuhsVSOUN50AXIw0kw6KwMHC1vfNZK\n`+
		// `uzFn6ll+XQvFdUhf/bGAmZ03scw0O7k1LX+8op8oESuMv9HX+UojF9TCwIMEGAEK\n`+
		// `AA8FAl7IIyUFCQ8JnAACGy4AqAkQ/KSLLwtRtUydIAQZAQoABgUCXsgjJQAKCRDM\n`+
		// `GlfckrMFZh1tA/0b+hKu5QRnaIZPmUUOI4co4fYd+GGD4bT35d1yz1Y7ZQvHSBFg\n`+
		// `sbdCcG5r8P80OAAQHfTeXMpePogJz8RjaA/2M5XlQmBbyn47D5lX5jMtLMya3SUG\n`+
		// `Y6KfWbcNEPadO1kJekwhDONjM++A4pJzIY+v92p+ENOyYXNprJMGzPLVyb3jA/9g\n`+
		// `NTvhpr3fmrZl7AuCf8jjWIHKjuiTio/K7EyzcxfoveYT8XwgKXWKXdDDaRc9LWkL\n`+
		// `TjpR0kiU7tzhv0DhH8igpep691TFBXuPUJ9iQ5ti4hVvpq74RJaXxGaGMjzVhsFY\n`+
		// `azLRP8vWSZl1whvKHvgK3Q72njqziwlwKj47l05C5A==\n`+
		// `=AeBv\n` +
		// `-----END PGP PRIVATE KEY BLOCK-----\n`

		// const { keys: [privateKey] } = await openpgp.key.readArmored(partnerPrivateKey)
		// await privateKey.decrypt(bankInfo.passphrase)

		// const { data: cleartext } = await openpgp.sign({
		// 	message: openpgp.cleartext.fromText(accountIdDecrypted), // CleartextMessage or Message object
		// 	privateKeys: [privateKey]                             // for signing
		// });

		// console.log(cleartext)

		digitalSignature = digitalSignature.replace(/\\n/g, '\n')


		const verified = await openpgp.verify({
			message: await openpgp.cleartext.readArmored(digitalSignature),           // parse armored message
			publicKeys: (await openpgp.key.readArmored(bankInfo.partner_public_key)).keys // for verification
		})
		const { valid } = verified.signatures[0]
		if (!valid) {
			return MakeResponse(req,res,{
				stauts: APIStatus.Invalid,
				message: 'Signature is invalid'
			})
		}
	}
	

	// Kiểm tra thời gian mà ngân hàng đối tác gửi request nhằm để check request này còn hạn hay không và check entryTime này có bị chỉnh sửa hay không
	const entryTimeHashed = req.headers['x_entry_time_hashed']
	let entryTimeEncrypted = req.headers['x_entry_time_encrypted']


	if (!entryTimeHashed || !entryTimeEncrypted) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'Require entrytime'
		})
	}

	// Decrypt entryTime bằng private key
	let entryTimeDecrypted = ''
	if (bankInfo.encrypt_type == 'RSA') {
		// eslint-disable-next-line no-undef
		const buffer = Buffer.from(entryTimeEncrypted, 'base64')
		entryTimeDecrypted = crypto.privateDecrypt({ key: bankInfo.our_private_key, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf-8')
		console.log('Entry time: ' + entryTimeDecrypted)
	} else if (bankInfo.encrypt_type == 'PGP') {
		const { keys: [privateKey] } = await openpgp.key.readArmored(bankInfo.our_private_key)
		await privateKey.decrypt(bankInfo.passphrase)

		entryTimeEncrypted = entryTimeEncrypted.replace(/\\n/g, '\n')

		const { data: decrypted } = await openpgp.decrypt({
			message: await openpgp.message.readArmored(entryTimeEncrypted),             // parse armored message
			publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key)).keys, // for verification (optional)
			privateKeys: [privateKey]                                           				// for decryption
		})

		entryTimeDecrypted = decrypted
		console.log('Entry time: ' + entryTimeDecrypted)
	}


	// Kiểm tra xem entryTime có hợp lệ hay không
	if (isNaN(entryTimeDecrypted)) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'Entry time must be an unix number'
		})
	}

	// Kiểm tra entryTime có bị chỉnh sửa hay không 
	if (entryTimeHashed != crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(entryTimeDecrypted).digest('hex')) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'Entry time is invalid'
		})
	}

	// Kiểm tra entryTime có bị "sớm" hơn thời điểm hiện tại hay không
	let currentTime = Math.round((new Date()).getTime() / 1000)
	if (entryTimeDecrypted > currentTime) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'Entry time is invalid (entrytime is greater than now)'
		})
	}

	// Kiểm tra entryTime có bị quá 5 phút kể từ thời điểm hiện tại hay không, tạm khóa lại, 5 phút đi test lại mệt mỏi
	// if (currentTime - entryTimeDecrypted > 3000) {
	// 	return MakeResponse(req,res,{
	// 	status: APIStatus.Invalid,
	// 	message: "Your entrytime is expired. Please try again"
	// 	})
	// }


	const accessedApiHistoryResp = await DBModelInstance.Query(AccessedApiHistory, { bank_id: bankInfo.bank_id, accessed_api_type: 'GET_INFO', entry_time: entryTimeDecrypted })
	if (accessedApiHistoryResp.status == APIStatus.Ok) {
		return MakeResponse(req, res, {
			status: APIStatus.Invalid,
			message: 'Your access is solved. Please make another request'
		})
	}

	const saveAccessedHistoryResponse = await DBModelInstance.Create(AccessedApiHistory, {
		bank_id: bankInfo.bank_id,
		accessed_api_type: 'GET_INFO',
		entry_time: entryTimeDecrypted
	})

	if (saveAccessedHistoryResponse.status != APIStatus.Ok) {
		return MakeResponse(req, res, {
			status: APIStatus.Error,
			message: saveAccessedHistoryResponse.message
		})
	}

	const queryCustomerResp = await DBModelInstance.Query(Customer, { default_account_id: accountIdDecrypted }, 'full_name', 0, 1, false)

	return MakeResponse(req, res, queryCustomerResp)
})

// @route     POST /transactions/sengding-interbank
// @desc      Chuyển khoản đến ngân hàng khác
// @access    Public
router.post('/transfering-interbank', [
	authCustomer,
	check('entryTime', 'Entry time is required').not().notEmpty(),
	check('toAccountId', 'Receiver account is required').not().notEmpty(),
	check('toFullName', 'Receiver full name is required').not().notEmpty(),
	check('toBankId', 'Receiver bank ID is required').not().notEmpty(),
	check('transactionAmount', 'Amount Transaction is 50000 or more').isInt({ min: 50000 })
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).send(errors)
	}

	const {
		entryTime,
		fromAccountId,
		toAccountId,
		toFullName,
		toBankId,
		transactionAmount
	} = req.body

	try {



		const customer = await Customer.findById(req.user.id)

		if (!customer) {
			return res.status(400).json({
				errors: [{
					msg: 'Customer not exists'
				}]
			})
		}

		const fromFullName = customer.full_name

		const account = await Account.findOne({ account_id: fromAccountId })

		if (!account) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		if (account.balance - transactionAmount < 0) {
			return res.status(400).json({
				errors: [{
					msg: 'Insufficient funds'
				}]
			})
		}

		const transactionTransferer = new Transaction({
			entry_time: entryTime,
			from_account_id: fromAccountId,
			from_fullname: fromFullName,
			to_account_id: toAccountId,
			to_fullname: toFullName,
			from_bank_id: 'EIGHT',
			to_bank_id: toBankId,
			transaction_type: 'TRANSFER',
			transaction_amount: transactionAmount,
			transaction_balance_before: account.balance,
			transaction_balance_after: account.balance - transactionAmount
		})

		// Kiểm tra ngân hàng người nhận có đúng mã id
		// ...

		// Gọi api chuyển  khoản vào ngân hàng khác
		// ...

		const accountTransfererResponse = await Account.findOneAndUpdate({ account_id: fromAccountId }, { $inc: { balance: -transactionAmount } }, {
			new: true
		})

		const transactionTransfererResponse = await transactionTransferer.save()

		return res.status(200).json({ transactionTransfererResponse, accountTransfererResponse })
	} catch (error) {
		return res.status(500).json({ msg: 'Server error' })
	}
})

// @route     POST /transactions/receiving-interbank
// @desc      Ngân hàng khác chuyển khoản vào
// @access    Public
router.post('/receiving-interbank', [
	// check('entryTime', 'Entry time is required').not().notEmpty(),
	// check('toAccountId', 'Receiver account is required').not().notEmpty(),
	// check('toFullName', 'Receiver full name is required').not().notEmpty(),
	// check('fromAccountId', 'Transferer account is required').not().notEmpty(),
	// check('fromFullName', 'Transferer full name is required').not().notEmpty(),
	// check('fromBankId', 'Transferer bank ID is required').not().notEmpty(),
	// check('transactionAmount', 'Amount Transaction is 50000 or more').isAfter('49999')
], async (req, res) => {
	
	try {

		const accessToken = req.headers['x_access_token']
		if (!accessToken) {
			return MakeResponse(req,res,{
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api'
			})
		}
	
		const bankInfo = await LinkedBank.findOne({access_token: accessToken})
		if (!bankInfo) {
			return MakeResponse(req,res,{
				status: APIStatus.Unauthorized,
				message: 'Not allow to access this api'
			})
		}
	
		const {
			data,
			data_hashed,
			digital_sign
		} = req.body





		//  test for encrypt body data with RSA
		// let bodyData = {
		// 	entryTime: 1590177239,
		// 	toAccountId: "87427921686253",
		// 	toFullName: "Lê Hoàng Sang",
		// 	fromAccountId: "1612556",
		// 	fromFullName: "Nguyễn Hoàng Sang",
		// 	fromBankId: "id001",
		// 	transactionAmount: 50000
		// }

		// console.log(JSON.stringify(bodyData))

		// let bodyDataEncrypted = crypto.publicEncrypt({
		// 	key: bankInfo.our_public_key,
		// 	//passphrase: '',
		// 	padding : crypto.constants.RSA_PKCS1_PADDING
		// },Buffer.from(JSON.stringify(bodyData))).toString('base64')


		//  console.log(bodyDataEncrypted);

		// let hashData = crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(JSON.stringify(bodyData)).digest('hex')
		// console.log(hashData)


		// test for encrypt body data with PGP
		// let bodyData = {
		// 	entryTime: 1590177239,
		// 	toAccountId: "87427921686253",
		// 	toFullName: "Lê Hoàng Sang",
		// 	fromAccountId: "1612556",
		// 	fromFullName: "Nguyễn Hoàng Sang",
		// 	fromBankId: "id001",
		// 	transactionAmount: 50000
		// }

		// const { data: bodyDataEncrypted } = await openpgp.encrypt({
		// 	message: openpgp.message.fromText(JSON.stringify(bodyData)),
		// 	publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key)).keys 
		// });

		// console.log(bodyDataEncrypted); 

		// decrypt body data
		let dataDecryptedObject = ""
		if (bankInfo.encrypt_type == 'RSA') {

			const buffer = Buffer.from(req.body.data,'base64')
			const dataDecryptedStr = crypto.privateDecrypt({ key: bankInfo.our_private_key, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf-8')
			dataDecryptedObject = JSON.parse(dataDecryptedStr)

		} else if (bankInfo.encrypt_type == 'PGP') {

			const { keys: [privateKey] } = await openpgp.key.readArmored(bankInfo.our_private_key)
			await privateKey.decrypt(bankInfo.passphrase)

			const { data: decrypted } = await openpgp.decrypt({
				message: await openpgp.message.readArmored(req.body.data),             // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.our_public_key)).keys, // for verification (optional)
				privateKeys: [privateKey]                                           				// for decryption
			})

			dataDecryptedObject = JSON.parse(decrypted)
		}


		// Kiểm tra xem entryTime có hợp lệ hay không
		if (isNaN(dataDecryptedObject.entryTime)) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time must be an unix number'
			})
		}

		// Kiểm tra entryTime có bị "sớm" hơn thời điểm hiện tại hay không
		let currentTime = Math.round((new Date()).getTime() / 1000)
		if (dataDecryptedObject.entryTime > currentTime) {
			return MakeResponse(req, res, {
				status: APIStatus.Invalid,
				message: 'Entry time is invalid (entrytime is greater than now)'
			})
		}

		// Kiểm tra entryTime có bị quá 5 phút kể từ thời điểm hiện tại hay không, tạm khóa lại, 5 phút đi test lại mệt mỏi
		// if (currentTime - dataDecryptedObject.entryTime > 3000) {
		// 	return MakeResponse(req,res,{
		// 	status: APIStatus.Invalid,
		// 	message: "Your entrytime is expired. Please try again"
		// 	})
		// }

		// Kiểm tra request này có quá hạn hay không dựa vào entryTime


		// Kiểm tra gói tin có bị chỉnh sửa hay không
		if (req.body.data_hashed != crypto.createHmac(bankInfo.hash_algorithm, bankInfo.secret_key).update(JSON.stringify(dataDecryptedObject)).digest('hex')) {
			return MakeResponse(req,res,{
				status: APIStatus.Invalid,
				message: "Your data is invalid"
			})
		}


		// test tạo chữ ký RSA bằng private key
		// let partnerPrivatekey = `-----BEGIN RSA PRIVATE KEY-----\n` +
		// `MIIEowIBAAKCAQEAg8Clzw466fDTywAWlYrytlUeqUhOe7KRdwHyTiw6KSDxHP6U\n` +
		// `QG+wscEuMf42Qa27MJj7mvMtayNwaW/blHrpIwsm2/uZOL+CxPeTO0/UDgoQiM01\n`+
		// `F6nROV9sCflTuiyF5SCHPluk5VAIKxDlofUoKGKoySXHJHOq9jJfTIBpnVKZQio1\n`+
		// `WzTHUefYg0W4a6O+OVzgfEm3PIAKBIQtEoPb5lpjAMmiB8i71XZ1C10g1NeoKj+g\n`+
		// `ewFb9uNNdnERMNaec9y+46kpqhvuihz/xLsZ2l3UvjpBfg/jLOvq1qmkdvwKDsWd\n`+
		// `j9VEDT+HVc1Kzlxtk87gID1aKE/odjxmwZ0i6wIDAQABAoIBACl+YrnzIVrMHeew\n`+
		// `/2vZdtc1t5JY017hvi5czpMQGsEZPtaC1u30PxG8ZXAZP70vmeSUSaljLMqxPpX2\n`+
		// `RJFepE4FFRfzBS56IhUmY5gqa/5/7PUoq6/oK5yGEOCTRWs82m5u8CkTc7tEmU32\n`+
		// `5Fs9eog9iirPWwh/5TfkZV8SkjCZfFLmPS20SuLCA7VPwEt6Zhxest3UL4Vz6915\n`+
		// `KGp1gA6O01R6hl0qoufFhk57+n8BqE1wyvzE54ZIKuYMx7p5EfJ+pYfgZx0/pFWP\n`+
		// `00NkMaJOjyHY/ZTcHMkAeFAqEgoCaPoNWO5MvuAr86MIldTofWlJwnYr9JkAc/GO\n`+
		// `Ke2tLgECgYEA5cJMbCvvgQxJenoORcxqT+fQsX9z+X+5lnGzMpxOumqlHa47b9sH\n`+
		// `EN1lDoz1h/f/Dytof3Bug3wEgy8d2sFIL7u0Gu3/iR0JPh8BOA/xK10kh8/HYQJy\n`+
		// `IEtR4jz83OnOxGawcxX64UeBpxFoR87+ZoM4fpE4JitZd+5GtZF3StkCgYEAkszV\n`+
		// `QGdp4ZIPZ0WzaMI3oAuiOI5o0z+1kSAM1kyPGLN8faQlFOhHbAfW4a5msSK/gJjs\n`+
		// `QjZurK6rYIbuoFFh02Np1LKDVsHG3JutVSkvrIX0BhRzR+bbdWwnUDuUipOrpcAE\n`+
		// `Qr2nBbzgKRxax+QAh3CMUBiQxy0fjnjZ9xgMGWMCgYBXoJILE3ql6izABHsbDcpi\n`+
		// `LVR/zc9KkfcTNMwWelzgZjoRJtlOYOfB+95F/WbLc78YZwLUz+mmRg9mhPrK6rqA\n`+
		// `UgNv3eN+xM84nRSW8CWX109OaOVuz0L9pBxXv9Dk5FtStqOHURO9BcuiD1aJRJ3s\n`+
		// `NRG/29zhWdkmj37yUsd/iQKBgAexJ/Np98hUCO6WXmI82wFN2sAv5ho7ml3yWfnY\n`+
		// `pR7cOMe0lCTWTvfAKWhF5See9H3ehXKqu33c4Sn7qAFKgl+7M85rVCp1mN/yYFC4\n`+
		// `CcF2e2TeKXQ5CoLKmfzAQnZIapQSzaZZnajVTsGYtMEIl2aBZTjFMMDfAmpKttEV\n`+
		// `t3yVAoGBANQzqxD08wStWsUckBPb9sLSB69O8m5l6MbOUM2aGZ0y/mcz4vB8WKiW\n`+
		// `9gXUjXH+xzmXLXkqEAqOSLMoux0/Of0qOpy8/WfKqqHGSSAR8aj5pPUgfCSbOZ+Y\n`+
		// `KoYfROw4GJlalGXtUGZNTDF3tk+9K253zdzt0LhKaagcv+6vDRLz\n`+
		// `-----END RSA PRIVATE KEY-----`
		// let bufferTest = crypto.sign(
		// 	'SHA1',
		// 	Buffer.from(JSON.stringify(dataDecryptedObject),'base64'),
		// 	{ key: partnerPrivatekey, padding: crypto.constants.RSA_PKCS1_PADDING }
		// )
		
		// console.log(bufferTest.toString('base64'))



		// tạo chữ ký PGP bằng private key
		// let partnerPrivateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n` +
		// `Version: Keybase OpenPGP v1.0.0\n`+
		// `Comment: https://keybase.io/crypto\n\n`+
		// `xcFGBF7IIyUBBACht5jrxjfRuGffvtvKDh2GF/Ze2wulKvRCvYKq5skU5ekPfIxH\n`+
		// `KRTj1OAZM0lmOtmL4NGo6oSPCcSC8VjMzQUZUJ6g1OVDanbQbGu89lGbXid6mC0T\n`+
		// `Jk2SoPL+VhGAej74fsB+Ficgvw1MikH6dFiiOietTrrMMPydgI+3Fpyx3wARAQAB\n`+
		// `/gkDCNovwRGZ5S3pYJ2tox7JYXbAJQKgVcouVnFfrPhoF2XI5BdWuLos03WPmJec\n`+
		// `5t8yGqsqDb29B8zImjSiJ+YVakRMyF9uNCFWOz4Tp0ekdkVXR61HD+D6mj8MH+/V\n`+
		// `yubGCSlyNFUwfKE9/FqRWGLhoqaEuZo7uCDmEnrJNgkyWUUC6jdFJx+9VSh+oylJ\n`+
		// `qNrRGuAu3NsUKks9M8haYxo2ABqe9RskmJKb1D6L0fNdXT+r8gxSPNVXRg9KGn19\n`+
		// `euiyzQtN4RD72FxFrcVQZQ663gX/5PK0kOD44bB7RcVd1Ro1EBKk9oCNbpOs58WA\n`+
		// `l7T0+0RhlCdsw02imopvEW77yfFOcJebUMDWwhxr9N3CagK7+HjePxl9yrYBg053\n`+
		// `Yjq1ihyDYezaDJxWQqn8wGERWlns1hZE/UdJT0lPJjdzp/snHk2QSmofMk6rpbX4\n`+
		// `JSXs84QJ3RNkHqAkIbCODPHi55DwUOV+Zd/HncM2H0JWbU9RX7X3hODNJ0zDqiBI\n`+
		// `b8OgbmcgU2FuZyA8bGhzYW5naGNtdXNAZ21haWwuY29tPsKtBBMBCgAXBQJeyCMl\n`+
		// `AhsvAwsJBwMVCggCHgECF4AACgkQ/KSLLwtRtUw1zAP9Eh0tsM95bmifyaZCrcbS\n`+
		// `xg9iFgWs4lq7m1aWv8ELwSQh1Fm63B28sWw2Mrq9cMyRAAoP6S973lVj1+f18Evt\n`+
		// `6jdGdJK870uqCuTVvUgUsUoAbwORY/1Hbb4fdb2k1Da3LJo/XeLr41vZw3OYahn5\n`+
		// `nvIOi/pLjbtrmCIs96KD1zvHwUYEXsgjJQEEAMUDxzfr45Ad6XblCzZyHrhYFmUc\n`+
		// `2ZiLyYaidXLgvRxEDFjriYFV0Gmq/CLdUd2oS6bKDg5+BhZOZ9+acX6X2OixonGA\n`+
		// `u+Bk/aVdPsQgyoOoHTJ3Q38b/dyif+c7RKnXWAKWww1suMEHy5AYtDO9vvB9G36M\n`+
		// `A0wRyvPm48YFbNhLABEBAAH+CQMI/rORlxGW14dgfS/KZpSWO3d5zhJsgo+bmnyP\n`+
		// `mS2wg6nbjEfXkjuouf1v7O3TMcCIjhbHjXN/ea8XQL6tMExh/8MlUFEjx0WDl3ce\n`+
		// `5aJi+4gF+tn0pdD/yfkBOBBHMcAOPleVAgVtNjmwTtkINu8vlQA4+RzQTWa8Eq/i\n`+
		// `x8Beqb3WU+4k0Cq5wP8/+Z6UMUDyO5S41fc/ySpg7BBFLhK8A/MVustWZVopvYiE\n`+
		// `2qmwW8MkAiG9SPCbL8tmhGQ7HY8CG4b2lRBEcbnKgYoDEU5CEl8wTmx274Asjn1V\n`+
		// `GrfwRKTnmnouzcWsZUt/luvg3vIAoshR/QqeYrxuH8fPY/8BjutiQ4Ggl9H2IsrB\n`+
		// `HZ672F0QhoqHgZObAk/Zu8bOlsJglHlbuTCWH+260qFLJOTDGhGdLCI7ksuhdsnn\n`+
		// `cgfnvJ0LtiCu1wGHuT1UkgmpDEBTPSwjpiyO0AN8Ab2kgnOedLUaWsKfoe+kC+Dc\n`+
		// `X8me271ELOtYXsLAgwQYAQoADwUCXsgjJQUJDwmcAAIbLgCoCRD8pIsvC1G1TJ0g\n`+
		// `BBkBCgAGBQJeyCMlAAoJEJUvc0gDY8k9hmoD+gIJOZvc1h1BN/cYw60jeFySu0Yu\n`+
		// `NvTaczUtw5ILklXpg+aBCY9kplv+/QmX9gGeUrBPxoyLdyVYfaCSK3CCwO48h0ol\n`+
		// `4HB0KZXKHkVmIJKUQXhA1b0yXCXDEV55NkZkVjJDEdC8t51GFClQ9YUTSUDDJn4x\n`+
		// `NuNBIkQqhMzqwBx3u90EAIuNOb/C8xCsSbWIgc2yQTHogWeD9TQD0XNpXYr5jg/w\n`+
		// `NdbRrScNSvHTsvn7iyRV9HESW2PCmibsaemvZCOdIksbAorS1ZUOJfkVETNSUKR9\n`+
		// `EaiMEl3sQxp472LcEBWhhU9lpN+iO9KhtnNnzRqT4bN9bDheji4Ps1VwwfYdH7pa\n`+
		// `x8FGBF7IIyUBBACbAhV+D7t4d77JlhzwSmTDldipX3gc0BEnF1Q8vv3sTElx2zh3\n`+
		// `P7kMmsNVbc8G9b9MQ9t81OHKWXEFekBB7WmeZbkY9FEe3PxYDwBZoisjzu6J0zOU\n`+
		// `xQHYeHHWycFBN97gb8KcdraL2Defpb3S4FxNLuCIoy5c04z2CnwSEJuKxQARAQAB\n`+
		// `/gkDCKdUUCO4HiDnYCQVWPBTlPrBxO8hci6WpoE4JyAd0emgo5PKe4HQmt5OSny7\n`+
		// `itIaFZX277dbDorvr+E2E8Q3dw+P50EMYfKgan54rWOq2Fx4FrYPx6wYuw4xQTo3\n`+
		// `/kKxMc3/vhXD8zpZsw+CXDVZ/iaNnr6JQwQeNFR9KgYPZjdCIQoRfzruN4qv/ItZ\n`+
		// `UvckNyyKpt6FGgNP1rqfvndllmIjsmimReghNz3OGalwPxsoNOJ8RbBkfjcKj+Nk\n`+
		// `vgzwEBAzit4cnNotQ2kM2HU2BkDrshUJdZikIqKkSP5C/5gJUjDQGtuXKVR6D6Tp\n`+
		// `pSevTPYWTwg+dnJ1Iu76lke7fyLXP9e3JA1W5a9A8Npc12I/jILAqxLroXgBazUl\n`+
		// `vpFGh05vlDYLwEih7hENRIYI0X0qr1q0i6CuhsVSOUN50AXIw0kw6KwMHC1vfNZK\n`+
		// `uzFn6ll+XQvFdUhf/bGAmZ03scw0O7k1LX+8op8oESuMv9HX+UojF9TCwIMEGAEK\n`+
		// `AA8FAl7IIyUFCQ8JnAACGy4AqAkQ/KSLLwtRtUydIAQZAQoABgUCXsgjJQAKCRDM\n`+
		// `GlfckrMFZh1tA/0b+hKu5QRnaIZPmUUOI4co4fYd+GGD4bT35d1yz1Y7ZQvHSBFg\n`+
		// `sbdCcG5r8P80OAAQHfTeXMpePogJz8RjaA/2M5XlQmBbyn47D5lX5jMtLMya3SUG\n`+
		// `Y6KfWbcNEPadO1kJekwhDONjM++A4pJzIY+v92p+ENOyYXNprJMGzPLVyb3jA/9g\n`+
		// `NTvhpr3fmrZl7AuCf8jjWIHKjuiTio/K7EyzcxfoveYT8XwgKXWKXdDDaRc9LWkL\n`+
		// `TjpR0kiU7tzhv0DhH8igpep691TFBXuPUJ9iQ5ti4hVvpq74RJaXxGaGMjzVhsFY\n`+
		// `azLRP8vWSZl1whvKHvgK3Q72njqziwlwKj47l05C5A==\n`+
		// `=AeBv\n` +
		// `-----END PGP PRIVATE KEY BLOCK-----\n`

		// const { keys: [privateKey] } = await openpgp.key.readArmored(partnerPrivateKey)
		// await privateKey.decrypt(bankInfo.passphrase)

		// const { data: cleartext } = await openpgp.sign({
		// 	message: openpgp.cleartext.fromText(JSON.stringify(dataDecryptedObject)), // CleartextMessage or Message object
		// 	privateKeys: [privateKey]                             // for signing
		// });

		// console.log(cleartext)

		// Kiểm tra chữ ký bất đối xứng
		if (bankInfo.encrypt_type == 'RSA') {
			// eslint-disable-next-line no-undef
			const bufferBodyData = Buffer.from(JSON.stringify(dataDecryptedObject), 'base64')
			// eslint-disable-next-line no-undef
			const bufferSignature = Buffer.from(req.body.digital_sign,'base64')
			const check = crypto.verify(
				bankInfo.hash_algorithm,
				bufferBodyData,
				{
					key: bankInfo.partner_public_key,
					padding: crypto.constants.RSA_PKCS1_PADDING
				},
				//bufferTest
				bufferSignature
			)
			if (!check) {
				return MakeResponse(req,res,{
					status: APIStatus.Invalid,
					message: 'Signature is invalid'
				})
			}
		} else if (bankInfo.encrypt_type == 'PGP') {
			req.body.digital_sign = `-----BEGIN PGP SIGNED MESSAGE-----\n` + 'Hash: SHA512\n\n' + JSON.stringify(dataDecryptedObject) + '\n' + req.body.digital_sign
			req.body.digital_sign = req.body.digital_sign.replace(/\\n/g, '\n')
			const verified = await openpgp.verify({
				message: await openpgp.cleartext.readArmored(req.body.digital_sign),           // parse armored message
				publicKeys: (await openpgp.key.readArmored(bankInfo.partner_public_key)).keys // for verification
			})
			const { valid } = verified.signatures[0]
			if (!valid) {
				return MakeResponse(req,res,{
					stauts: APIStatus.Invalid,
					message: 'Signature is invalid'
				})
			}
		}

		const saveAccessedHistoryResponse = await DBModelInstance.Create(AccessedApiHistory, {
			bank_id: bankInfo.bank_id,
			accessed_api_type: 'TRANSFER',
			entry_time: dataDecryptedObject.entryTime
		})
	
		if (saveAccessedHistoryResponse.status != APIStatus.Ok) {
			return MakeResponse(req, res, {
				status: APIStatus.Error,
				message: saveAccessedHistoryResponse.message
			})
		}


		const account = await Account.findOne({ account_id: dataDecryptedObject.toAccountId })

		if (!account) {
			return res.status(400).json({
				errors: [{
					msg: 'Account not exists'
				}]
			})
		}

		const transactionReceiver = new Transaction({
			entry_time: dataDecryptedObject.entryTime,
			from_account_id: dataDecryptedObject.fromAccountId,
			from_fullname: dataDecryptedObject.fromFullName,
			to_account_id: dataDecryptedObject.toAccountId,
			to_fullname: dataDecryptedObject.toFullName,
			from_bank_id: dataDecryptedObject.fromBankId,
			to_bank_id: 'EIGHT',
			transaction_type: 'RECEIVE',
			transaction_amount: dataDecryptedObject.transactionAmount,
			transaction_balance_before: account.balance,
			transaction_balance_after: Number(account.balance) + Number(dataDecryptedObject.transactionAmount)
		})

		const accountReceiverResponse = await Account.findOneAndUpdate({ account_id: dataDecryptedObject.toAccountId }, { $inc: { balance: dataDecryptedObject.transactionAmount } }, {
			new: true
		})

		const transactionReceiverResponse = await transactionReceiver.save()

		return res.status(200).json({ transactionReceiverResponse, accountReceiverResponse })
	} catch (error) {
		// console.log(error)
		return res.status(500).json({ msg: error.toString() })
	}
})

module.exports = router
