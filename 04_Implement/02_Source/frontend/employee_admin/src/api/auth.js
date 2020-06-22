import request from "@/request/auth.staff.js"

export function logIn(data) {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}