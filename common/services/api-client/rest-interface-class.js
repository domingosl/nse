const Requestor = require('./requestor-class');

const prepareURL = (url, _params) => {

    let params;
    if(typeof _params === 'string')
        params = [_params];
    else
        params = _params;

    return url.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] !== 'undefined'
            ? params[number]
            : match
            ;
    })

};

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

    read(params = []) {
        return new Requestor(this.rootContext, prepareURL(this.readEndpoint, params), 'GET', null, this.isPublic.read);
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