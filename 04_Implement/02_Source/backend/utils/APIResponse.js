class APIResponse {
  constructor(object) {
    this.status = object.status ? object.status : undefined
    this.data = object.data ? object.data : undefined
    this.message = object.message ? object.message : undefined
    this.total = object.total ? object.total : undefined
    this.errorCode = object.errorCode ? object.errorCode : undefined
  }
}

module.exports = APIResponse
