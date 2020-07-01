import request from "@/request/employee.js"

export function getCustomer(payload) {
    return request({
        url: `/all-customers?offset=${(payload.index-1) * payload.limit}&limit=${payload.limit}&getTotal=${payload.getTotal}&reverse=${payload.reverse}&search=${payload.search}`,
        method: 'get'
    })
}

export function getCustomerWithBalance(payload) {
    return request({
        url: `/customer-detail?email=${payload.q.email}`,
        method: 'get'
    })
}

export function rechargeMoney(payload) {
    return request({
        url: `/recharge-customer`,
        data: payload.data,
        method: 'post'
    })
}

export function getTransactionHistory(payload) {
    return request({
        url: `/transaction-history/${payload.type}?historyAccountId=${payload.data.historyAccountId}`,
        method: 'get'
    })
}