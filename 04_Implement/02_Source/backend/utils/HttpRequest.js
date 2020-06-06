const RequestLogEntry = require('../models/RequestLogEntry')
const https = require('https')
const axios = require('axios');
class RestClient {
    constructor(baseURL, userAgent, logName, maxRetryTime, waitTime, timeOut, dbModel) {
        this.baseURL = baseURL
        this.userAgent = userAgent
        this.logName = logName
        this.maxRetryTime = maxRetryTime
        this.waitTime = waitTime
        this.timeOut = timeOut
        this.dbModel = dbModel
    }

    newRestClient(baseURL,logName, timeOut, maxRetryTime, waitTime,dbModel) {
        if (!baseURL.startsWith("http")) {
            baseURL  = "http://" + baseURL
        }
        return new RestClient(baseURL,"",logName,maxRetryTime,waitTime,timeOut,dbModel)
    }

     makeHTTPRequest(httpMethod,headers,params,body,path,key) {
        return new Promise((resolve,reject) => {
          this.makeHTTPRequestProcess(httpMethod,headers,params,body,path,key).then(response => {
            resolve(response)
          }).catch(err => reject(err))
          
        })
    }

    async makeHTTPRequestProcess(httpMethod, headers, params, body, path, key) {
        let date = new Date()

        let logEntry = {
            req_url: this.baseURL + path,
            req_method: httpMethod,
            req_form_data: params,
            req_header: headers,
            req_body: body,
            keys: key,
            date: date
        }

        let tStart = Math.round(date.getTime() / 1000000)

        let canRetryCount = this.maxRetryTime

        let callResult = []

        while (canRetryCount > 0) {
            // let options = this.initRequest(httpMethod,headers,params,body,path)

             let startCallTime =  Math.round(new Date().getTime() / 1000000)

            // const req = https.request(options, (res) => {
            //     console.log(`statusCode: ${res.statusCode}`)
              
            //     res.on('data', async (d) => {
            //         console.log(d)
            //         let tend = Math.round(new Date().getTime() / 1000000)
            //         logEntry.status = "SUCCESS"
            //         callResult.push({response_time:tend - startCallTime})
            //         logEntry.result = callResult
            //         await this.writeLog(logEntry)
            //         return d
            //     })
            // })
              
            // req.on('error', (error) => {
            //     console.error(error)
            //     let tend = Math.round(new Date().getTime() / 1000000)
            //     logEntry.status = "FAILED"
            //     callResult.push({response_time:tend - startCallTime})
            //     logEntry.result = callResult
            // })

            let instance = axios.create({
                baseURL: 'http://localhost:3001/translate?text=hello&enToVi=true',
                timeout: 5000
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
                method:'get',
                url:''
            })

            if (response && !response.error) {
                let tend = Math.round(new Date().getTime() / 1000000)
                logEntry.status = "SUCCESS"
                callResult.push({response_time:tend - startCallTime})
                logEntry.result = callResult
                await this.writeLog(logEntry)
                return response
            } else {
                let tend = Math.round(new Date().getTime() / 1000000)
                logEntry.status = "FAILED"
                callResult.push({response_time:tend - startCallTime})
              //  await this.writeLog(logEntry)
               
            }
           
            canRetryCount--
        }
        await this.writeLog(logEntry)

        return {
            status :"OK",
            message: "Can not call endpoint API"
        }
      
       
    }

    initRequest(httpMethod, headers,params, body,path) {
        // let u = this.baseURL
        // if (path != "") {
        //     if (path.startsWith("/") || u.endsWith("/")) {
        //         u = u + path
        //     } else {
        //         u = u + "/" + path
        //     }
        // }

        // let urlStr  = addParams(u,params)

        // const options = {
        //     host: "localhost",
        //     port: 3001,
        //     path: '/translate',
        //     method: httpMethod,
        //     headers
        // }

        // return options
    }

    async writeLog(logEntry) {
        await this.dbModel.Create(RequestLogEntry,logEntry)
    }

    readBody() {

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