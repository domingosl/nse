const Requestor = require('./requestor-class');

const prepareURL = (url, _urlParams, _queryParams) => {

    let params;
    if(typeof _urlParams === 'string')
        params = [_urlParams];
    else
        params = _urlParams;

    let res = url.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] !== 'undefined'
            ? params[number]
            : match
            ;
    });

    if(_queryParams)
        res += '?' + serialize(_queryParams);

    return res;

};

const serialize = (obj) => {
    const str = [];

    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }

    return str.join("&");
}

module.exports = class RestInterface {

    constructor(rootContext, createEndpoint, readEndpoint, editEndpoint, listEndpoint, deleteEndpoint) {

        this.rootContext = rootContext;

        this.isPublic = { create: false, read: false, edit: false, list: false, delete: false };

        this.createEndpoint = createEndpoint;
        this.readEndpoint = readEndpoint;
        this.editEndpoint = editEndpoint;
        this.listEndpoint = listEndpoint;
    }

    setPublic(options) {
        this.isPublic = {...this.isPublic, options};
        return this;
    }

    create(payload) {
        return new Requestor(this.rootContext, this.createEndpoint, 'POST', payload, this.isPublic.create);
    }

    read(urlParams = [], queryParams = null) {
        return new Requestor(this.rootContext, prepareURL(this.readEndpoint, urlParams, queryParams), 'GET', null, this.isPublic.read);
    }

    list(payload) {
        return new Requestor(this.rootContext, this.listEndpoint, 'GET', payload, this.isPublic.list);
    }

    update(params = [], payload) {
        return new Requestor(this.rootContext, prepareURL(this.editEndpoint, params), 'PUT', payload, this.isPublic.update);
    }

    delete(params) {
        return new Requestor(this.rootContext, prepareURL(this.editEndpoint, params), 'DELETE', null, this.isPublic.delete);
    }
};