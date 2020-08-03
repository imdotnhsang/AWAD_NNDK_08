export function checkIsExpired(data) {
    return (data && data.error && data.error.response && data.error.response.status && (data.error.response.status == 401 || data.error.response.status == 403))
}

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function isVietnamesePhoneNumber(number) {
    return /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  }