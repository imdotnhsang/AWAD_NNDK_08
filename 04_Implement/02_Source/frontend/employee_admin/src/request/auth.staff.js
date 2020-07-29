import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: "http://34.87.97.142/auth", // url = base url + request url
   //baseURL: "http://localhost:5000/auth",
    timeout: 15000,
    withCredentials:true // request timeout
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
    return response;
}, (error) => {
    return Promise.resolve({ error });
});

export default service