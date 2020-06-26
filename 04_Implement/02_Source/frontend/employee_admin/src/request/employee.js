import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: "http://34.87.97.142/employees", // url = base url + request url
    timeout: 5000, // request timeout,
    withCredentials:true
})

// request interceptor
service.interceptors.request.use(
    config => {
      //  config.cookies["access_token"] = `${window.localStorage.getItem("wnc_access_token")}`
       // config.cookies["refresh_token"] = `${window.localStorage.getItem("wnc_refresh_token")}`
       // config.headers["Cookie"] = `access_token=${window.localStorage.getItem("wnc_access_token")}; refresh_token=${window.localStorage.getItem("wnc_refresh_token")}`
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