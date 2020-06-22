import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: "http://35.198.211.163/auth/staffs", // url = base url + request url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        // do something with request error
        console.log("error ne", error) // for debug
        return Promise.reject(error)
    }
)

service.interceptors.response.use((response) => {
    console.log(response)
    return response;
}, (error) => {
    console.log(error)
    return Promise.resolve({ error });
});

export default service