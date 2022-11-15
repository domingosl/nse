function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr);

    return array.map(it => {
        return Object.values(it).toString();
    }).join('\n');
}

module.exports = (req, res, next) => {

    function prepare(data) {
        if(data && typeof data.getPublicFields === 'function')
            data = data.getPublicFields();

        if(data && typeof data.toJSON === 'function')
            data = data.toJSON();

        if(data && typeof data === 'object') {
            delete data.__v;
            delete data.mangopayId;
        }

        return data;
    }

    function getForm(code, payload = {}, message = "") {

        let response = {code};

        if (Array.isArray(payload))
            payload = payload.map(row => prepare(row));
        else
            payload = prepare(payload);

        if(payload)
            response.data = payload;
        if(message)
            response.message = message;
        if(pagination)
            response.pagination = pagination;

        response.requestTime = (new Date().getTime() - req.locals.requestStart) + "ms";
        return res.status(code).json(response);

    }

    let pagination;
    if(!req.locals)
        req.locals = {enrich: {}};

    req.locals.requestStart = new Date().getTime();

    res.setPagination = (p) => {
        pagination = p;
        return res;
    };

    res.errorConstants = {
        MISSING_EMAIL_CONFIRMATION: 100,
        MISSING_PHONE_NUMBER_FOR_SMS_OTP: 101,
        INVALID_SMS_OTP: 102,
        SMS_OTP_SENT: 103
    };

    res.resolve = (payload) => getForm(200, payload);
    res.resolveAsCSV = (payload) => {
        res.header('Content-Type', 'text/csv');
        res.attachment('export.csv');
        return res.send(convertToCSV(payload));
    };
    res.badRequest = (payload) => getForm(400, payload);
    res.unauthorized = (message) => getForm(401, null, message);
    res.forbidden = (message) => getForm(403, null, message);
    res.conflict = (reason, message) => getForm(409, { reason }, message);
    res.notFound = () => getForm(404, null, null);
    res.applicationError = (message = null) => getForm(500, null, message);
    res.tooManyRequests = (message) => getForm(429, null, message);
    res.timeout = (message) => getForm(408, null, message);
    res.unavailable = (message) => getForm(503, null, message);
    res.aggregationResolve = (payload) => { return res.status(200).json({code: 200, ...payload}); };
    res.apiErrorResponse = (error) => {

        if(error && error.name === 'ValidationError')
            return getForm(400, error.data);

        if(error && error.name === 'ForbiddenError')
            return getForm(403, null, error.message);

        return getForm(500, null, null);

    };

    next();
};
