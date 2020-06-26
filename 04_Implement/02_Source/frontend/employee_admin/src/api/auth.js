import request from "@/request/auth.staff.js"

export function logIn(data) {
    return request({
        url: '/staffs/login',
        method: 'post',
        data
    })
}

export function logOut() {
    return request({
        url: '/logout',
        method: 'post'
    })
}