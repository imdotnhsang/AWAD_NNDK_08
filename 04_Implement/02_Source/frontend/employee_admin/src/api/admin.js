import request from "@/request/admin.js"

export function getEmployee(payload) {
    return request({
        url: `/all-staffs?offset=${(payload.index-1) * payload.limit}&limit=${payload.limit}&getTotal=${payload.getTotal}&reverse=${payload.reverse}&search=${payload.search}`,
        method: 'get'
    })
}

export function createStaff(payload) {
    return request({
        url: "/register-staff",
        method: 'post',
        data:payload.data
    })
}

export function activeStaff(payload) {
    return request({
        url: "/activate-staff",
        method: 'put',
        data: payload.data
    })
}

export function deactiveStaff(payload) {
    return request({
        url: "/deactivate-staff",
        method: 'put',
        data: payload.data
    })
}