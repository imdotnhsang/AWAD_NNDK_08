const RequestLogEntry = require('../models/RequestLogEntry')
const axios = require('axios');
class RestClient {
    constructor(baseURL, userAgent, maxRetryTime, waitTime, timeOut, dbModel) {
        this.baseURL = baseURL
        this.userAgent = userAgent
        this.maxRetryTime = maxRetryTime
        this.waitTime = waitTime
        this.timeOut = timeOut
        this.dbModel = dbModel
    }

    newRestClient(baseURL, timeOut, maxRetryTime, waitTime,dbModel) {
        if (!baseURL.startsWith("http")) {
            baseURL  = "http://" + baseURL
        }
        return new RestClient(baseURL,"",maxRetryTime,waitTime,timeOut,dbModel)
    }

    //  makeHTTPRequest(httpMethod,headers,params,body,path,key) {
    //     return new Promise((resolve,reject) => {
    //       this.makeHTTPRequestProcess(httpMethod,headers,params,body,path,key).then(response => {
    //         resolve(response)
    //       }).catch(err => reject(err))
          
    //     })
    // }

    async makeHTTPRequest(httpMethod, headers, params, body, path, key) {
        let date = new Date()

        let logEntry = {
            req_url: this.baseURL + path,
            req_method: httpMethod,
            req_form_data: params,
            req_header: headers,
            req_body: body,
            keys: key,
            date: date,
            results: []
        }

        let tStart = Math.round(date.getTime() / 1000000)

        let canRetryCount = this.maxRetryTime

      

        while (canRetryCount > 0) {

            let callResult = {}

            let options = this.initRequest(httpMethod,headers,params,body,path)

            
            let startCallTime =  Math.round(new Date().getTime() / 1000000)



            let instance = axios.create({
                baseURL: options.host,
                timeout: this.timeOut,
                headers: options.headers
            })
        
            instance.interceptors.request.use(
                config => {
                    return config
                },
                error => {
                    console.log("error ne", error)
                    return Promise.reject(error)
                }
            )
            
            
            instance.interceptors.response.use((response) => {
                return response;
            }, (error) => {
                return Promise.resolve({ error });
            });
        
            const response = await instance({
                method:options.method,
                data: options.body ? options.body : undefined
            })

            if (response || (response.error && response.error.response)) {
                let tEnd = Math.round(new Date().getTime() / 1000000)
                logEntry.status = "SUCCESS"
                this.readBody(response,callResult,logEntry,canRetryCount,startCallTime,tStart)
                await this.writeLog(logEntry)
                return response && response.error && response.error.response ? response.error.response : response
            } else {
                callResult["error_log"] = response
            }

            let tEnd = Math.round(new Date().getTime() / 1000000)
            callResult["resp_time"] = startCallTime - tEnd

            canRetryCount--

            if (canRetryCount >= 0) {
                this.sleep(this.waitTime)
            }

            if (canRetryCount >= 0) {
                logEntry["retry_count"] = this.maxRetryTime - canRetryCount
            }

            logEntry.results.push(callResult)


        }

        let tEnd = Math.round(new Date().getTime() / 1000000)

        logEntry["total_time"] = tEnd - tStart
        logEntry.status = "FAILED"

        await this.writeLog(logEntry)

        return {
            status :"ERROR",
            message: "fail to call endpoint api " + logEntry.req_url
        }
      
       
    }

    initRequest(httpMethod, headers,params, body,path) {
        let u = this.baseURL
        if (path != "") {
            if (path.startsWith("/") || u.endsWith("/")) {
                u = u + path
            } else {
                u = u + "/" + path
            }
        }

        let urlStr  = addParams(u,params)

        if (body != null) {
            headers["Content-Type"] = "application/json"
        }

        headers["Accept"] = "application/json"
        headers["User-Agent"] = "NodeJs-RESTClient/1.0"

        const options = {
            host: urlStr,
            method: httpMethod,
            headers,
            body
        }

        return options
    }

    async writeLog(logEntry) {
        await this.dbModel.Create(RequestLogEntry,logEntry)
    }

    readBody(response, callResult, logEntry, canRetryCount, startCallTime, tStart) {

        callResult["resp_code"] = response.status ? response.status : response.error.response.status
        callResult["resp_body"] = response.data ? response.data : response.error.response.data
        callResult["resp_header"] = response.headers ? response.headers : response.error.response.headers

        let status = callResult["resp_code"]

        if ((status >= 200 && status < 300) || (status >= 400 && status <= 500)) {
            let tEnd = Math.round(new Date().getTime() / 1000000)
            callResult["resp_time"] = tEnd - startCallTime
            logEntry["total_time"] = tEnd  -  tStart
            if (canRetryCount >= 0) {
                logEntry["retry_count"] = this.maxRetryTime - canRetryCount
            }
            logEntry.results.push(callResult)
        }
    }

    sleep(msec) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }

}

function addParams(baseURL, params) {
    if (params != "" && Object.keys(params).length != 0) {
        baseURL+="?"
        const n = Object.keys(params).length
        let i = 0
        for (const property in params) {
           i++
          baseURL+=`${property.toString()}=${params[property]}`
          if (i<n) {
            baseURL+="&"
          }
        }
        return baseURL
    }
    return baseURL
}

module.exports = RestClient