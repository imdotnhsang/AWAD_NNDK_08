export function getPageInUrl() {
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    let page = params.get("page");
    if (page != null) {
        page = parseInt(page);
        if (isNaN(page) || page == 0) {
            return 1;
        }
        if (page < 1) {
            return 1
        }
        return page;
    }
    return 1;
}

export function getLimitInUrl() {
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    let limit = params.get("limit");
    if (limit != null) {
        limit = parseInt(limit);
        if (isNaN(limit) || limit == 0) {
            return 10;
        }
        if (limit < 1) {
            return 10
        }
        if (limit > 1000) {
            return 10
        }
        return limit;
    }
    return 10;
}

export function setUrlDefault(page, limit) {
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?page=${page}&limit=${limit}`
    window.history.replaceState({}, null, newUrl);
}

export function getSearchTextInUrl() {
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    let search = params.get("search");
    if (search != null) {
      return search
    }
    return "";
}

export function setUrlWithSearch(page,limit,search) {
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?page=${page}&limit=${limit}&search=${search}`
    window.history.replaceState({}, null, newUrl);
}

export function getAccountIdInUrl() {
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    let accountId = params.get("accountId");
    if (accountId != null) {
      return accountId
    }
    return "";
}

export function getTransactionTypeInUrl() {
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    let transactionType = params.get("transactionType");
    if (transactionType != null) {
      return transactionType
    }
    return "";
}

export function setUrlDefaultWithTransactionType(page, limit,accountId,transactionType) {
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?page=${page}&limit=${limit}&accountId=${accountId}&transactionType=${transactionType}`
    window.history.replaceState({}, null, newUrl);
}
