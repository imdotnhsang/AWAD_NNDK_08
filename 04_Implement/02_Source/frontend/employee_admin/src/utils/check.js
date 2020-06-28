export function checkIsExpired(data) {
    return (data && data.error && data.error.response && data.error.response.status && (data.error.response.status == 401 || data.error.response.status == 403))
}