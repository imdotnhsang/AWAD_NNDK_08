import request from "@/request/employee.js"

export function getCustomer(payload) {
    return request({
        url: `/all-customers?offset=${(payload.index-1) * payload.limit}&limit=${payload.limit}&getTotal=${payload.getTotal}&reverse=${payload.reverse}`,
        method: 'get'
    })
}