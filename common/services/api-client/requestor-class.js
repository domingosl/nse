module.exports = class Requestor {

    constructor(rootContext, endpoint, method, payload, isPublic = false) {
        this.rootContext = rootContext;
        this.endpoint = endpoint;
        this.method = method;
        this.payload = payload;
        this.isPublic = isPublic;
    }

    async execute() {
        return await this.rootContext.makeRequest(this.endpoint, this.method, this.payload, this.isPublic);
    }
};