const APIStatus = {
    Ok:           "OK",
	Error:        "ERROR",
	Invalid:      "INVALID",
	NotFound:     "NOT_FOUND",
	Forbidden:    "FORBIDDEN",
	Existed:      "EXISTED",
	Unauthorized: "UNAUTHORIZED",
}

function MakeResponse(req,res,apiResponse) {
    switch (apiResponse.status) {
        case APIStatus.Ok:
            res.status(200).json(apiResponse)
            break
        case APIStatus.Invalid:
            res.status(400).json(apiResponse)
            break
        case APIStatus.Error:
            res.status(500).json(apiResponse)
            break
        case APIStatus.NotFound:
            res.status(404).json(apiResponse)
            break
        case APIStatus.Forbidden:
            res.status(403).json(apiResponse)
            break
        case APIStatus.Existed:
            res.status(409).json(apiResponse)
            break
        case APIStatus.Unauthorized:
            res.status(401).json(apiResponse)
            break
    }
}

module.exports.APIStatus = APIStatus
module.exports.MakeResponse = MakeResponse
