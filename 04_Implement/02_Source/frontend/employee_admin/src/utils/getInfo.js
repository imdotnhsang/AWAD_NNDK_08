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

export function getLimitInUrl10() {
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