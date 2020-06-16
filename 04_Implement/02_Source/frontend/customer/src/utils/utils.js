/* eslint-disable no-prototype-builtins */
import React from 'react'
import { DebtType } from '../constants/constants'

export function isValidEmail(email) {
	// eslint-disable-next-line no-control-regex
	return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(
		email
	)
}

export function setJwtToStorage(jwt) {
	sessionStorage.setItem('jwt', jwt)
}

export function getJwtFromStorage() {
	const data = sessionStorage.getItem('jwt')
	return data
}

export function setNameToStorage(name) {
	localStorage.setItem('fullName', name)
}

export function getNameFromStorage() {
	const data = localStorage.getItem('fullName')
	return data
}

export function setEmailToStorage(email) {
	localStorage.setItem('email', email)
}

export function getEmailFromStorage() {
	const data = localStorage.getItem('email')
	return data
}

export function setBankIDToStorage(id) {
	sessionStorage.setItem('bankID', id)
}

export function getBankIDFromStorage() {
	const data = sessionStorage.getItem('bankID')
	return data
}

export function setAccountIDToStorage(id) {
	localStorage.setItem('accountID', id)
}

export function getAccountIDFromStorage() {
	const data = localStorage.getItem('accountID')
	return data
}

export function clearStorage() {
	localStorage.clear()
}

export function objectToQueryString(obj) {
	return Object.keys(obj)
		.map((key) => `${key}=${obj[key]}`)
		.join('&')
}

export function isNumber(value) {
	return /^[0-9]*$/.test(value)
}

export function isAuthenticated() {
	return getAccountIDFromStorage()
}

export function milisecondToDatetime(time) {
	const date = new Date(time)
	return `${date.toLocaleTimeString('en-GB')} ${date.toLocaleDateString(
		'en-GB'
	)}`
}

export function aliasFullname(value) {
	let result = value.toLowerCase()
	result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
	result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
	result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
	result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
	result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
	result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
	result = result.replace(/đ/g, 'd')
	result = result.replace(
		/!|@|%|\^|\*|\(|\)|\+|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
		' '
	)
	result = result.replace(/ + /g, ' ')
	result = result.trim().toUpperCase()
	return result
}

export function spaceSeparating(value, number) {
	return value
		.toString()
		.replace(new RegExp(`\\B(?=(\\d{${number}})+(?!\\d))`, 'g'), ' ')
}

export function commaSeparating(value, number) {
	return value
		.toString()
		.replace(new RegExp(`\\B(?=(\\d{${number}})+(?!\\d))`, 'g'), ',')
}

export function fixBalanceOneThousandBillion(value) {
	let result = value
	if (result > 100000000000) {
		result = parseInt(value / 1000) + 'k'
	}
	return result
}

export function getMonthYear(time) {
	return new Date(time).toLocaleDateString('en-GB').slice(3)
}

export function fourDigit(cardNumber) {
	return cardNumber.slice(cardNumber.length - 4)
}

export function generateErrorResponse(res) {
	const { status } = res && res
	let error = ''
	switch (status) {
		case 500:
			error = res.data.msg || 'Something wrong happened ...'
			break
		case 401:
			error = res.data.msg || 'Something wrong happened ...'
			break
		case 204:
			error = 'No content...'
			break
		default:
			error =
				(res.data.errors && res.data.errors[0].msg) ||
				'Something wrong happened ...'
			break
	}
	return { status, error }
}

export const resolveTagFromProps = (styleModifiers, tag) => ({
	children,
	...props
}) => {
	// eslint-disable-next-line no-param-reassign
	styleModifiers.map(
		(propName) => !!props.hasOwnProperty(propName) && delete props[propName]
	)
	return React.createElement(tag, props, children)
}

export function getUrlFromCategory(category) {
	return category.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

export function getDebtType(lenderID) {
	const yourID = getAccountIDFromStorage()
	if (lenderID === yourID) return DebtType.LOAN
	return DebtType.DEBT
}

export function getAmountFactTransaction(
	typeHistory,
	amount,
	feePayer,
	bankID
) {
	let amountFact = amount
	switch (typeHistory) {
		case 'receive':
			if (bankID === 'EIGHT.Bank') {
				if (feePayer === 'RECEIVER') {
					amountFact = amount - 1100
				}
			} else {
				if (feePayer === 'RECEIVER') {
					amountFact = amount - 3300
				}
			}
			break
		case 'transfer':
			if (bankID === 'EIGHT.Bank') {
				if (feePayer === 'TRANSFERER') {
					amountFact = amount + 1100
				}
			} else {
				if (feePayer === 'TRANSFERER') {
					amountFact = amount + 3300
				}
			}
			break
		default:
			break
	}
	return amountFact
}

export function getNotificationType(
	status,
	cancelledByAccountId,
	borrowerAccountId,
	lenderAccountId,
	currentAccountId
) {
	let type = 0
	switch (status) {
		case 'PAID':
			type = 2
			break
		case 'CANCELLED':
			if (
				cancelledByAccountId !== currentAccountId &&
				lenderAccountId === currentAccountId
			) {
				type = 1
			} else if (
				cancelledByAccountId !== currentAccountId &&
				borrowerAccountId === currentAccountId
			) {
				type = 0
			}
			break
		default:
			break
	}
	return type
}

export function getNotificationMessage(
	status,
	cancelledByAccountId,
	borrowerAccountId,
	lenderAccountId,
	currentAccountId,
	borrowerFullname,
	lenderFullname
) {
	let message = ''
	switch (status) {
		case 'PAID':
			message = `${aliasFullname(borrowerFullname)} / ${fourDigit(
				borrowerAccountId
			)} (Borrower) has repaid a debt collection to you`
			break
		case 'CANCELLED':
			if (
				cancelledByAccountId !== currentAccountId &&
				lenderAccountId === currentAccountId
			) {
				message = `${aliasFullname(borrowerFullname)} / ${fourDigit(
					borrowerAccountId
				)} (Borrower) has cancelled a debt collection of you`
			} else if (
				cancelledByAccountId !== currentAccountId &&
				borrowerAccountId === currentAccountId
			) {
				message = `${aliasFullname(lenderFullname)} / ${fourDigit(
					lenderAccountId
				)} (Lender) has cancelled a debt collection to you`
			}
			break
		default:
			break
	}
	return message
}
