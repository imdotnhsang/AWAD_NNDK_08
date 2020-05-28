export function isValidEmail(email) {
  // eslint-disable-next-line no-control-regex
  return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email)
}

export function setJwtToStorage(jwt) {
  sessionStorage.setItem('jwt', jwt)
}

export function getJwtFromStorage() {
  const data = sessionStorage.getItem('jwt')
  return data
}

export function clearStorage() {
  sessionStorage.clear()
}

export function objectToQueryString(obj) {
  return Object.keys(obj).map((key) => (`${key}=${obj[key]}`)).join('&')
}

export function isNumber(value) {
  return /^[0-9]*$/.test(value)
}

export function isAuthenticated() {
  return getJwtFromStorage()
}

export function milisecondToDatetime(time) {
  const date = new Date(time)
  return `${date.toLocaleTimeString('en-GB')} ${date.toLocaleDateString('en-GB')}`
}

export function spaceSeparating(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function getMonthYear(time) {
  return new Date(time).toLocaleDateString('en-GB').slice(3)
}

export function fourDigit(cardNumber) {
  return cardNumber.slice(cardNumber.length - 4)
}
