function GetQuery(queryName,req) {
    let data = req.query[queryName]
    if (queryName == "offset" || queryName == "limit") {
        try {
            data = parseInt(data)
            return data
        } catch {
            return 0
        }
    } else if (queryName == "reverse" || queryName == "getTotal") {
        return data === 'true'
    }
}

module.exports.GetQuery = GetQuery