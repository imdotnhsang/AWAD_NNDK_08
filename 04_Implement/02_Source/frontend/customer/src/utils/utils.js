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
	sessionStorage.setItem('name', name)
}

export function getNameFromStorage() {
	const data = sessionStorage.getItem('name')
	return data
}

export function setEmailToStorage(email) {
	sessionStorage.setItem('email', email)
}

export function getEmailFromStorage() {
	const data = sessionStorage.getItem('email')
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
	sessionStorage.setItem('accountID', id)
}

export function getAccountIDFromStorage() {
	const data = sessionStorage.getItem('accountID')
	return data
}

export function clearStorage() {
	sessionStorage.clear()
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
	return getEmailFromStorage()
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
	result = result.replace(/!|@|%|\^|\*|\(|\)|\+|\[|\]|~|\$|_|`|-|{|}|\||\\/g,' ')
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

export function getMonthYear(time) {
	return new Date(time).toLocaleDateString('en-GB').slice(3)
}

export function fourDigit(cardNumber) {
	return cardNumber.slice(cardNumber.length - 4)
}

export function generateErrorResponse(res) {
	const { status } = res
	const error = res.data.error || 'Something wrong happended ...'
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
