const axios = require('axios');

const RestInterface = require('./rest-interface-class');

const baseURLTplFEDev = "/api";
const baseURLTplFEProd = "TODO";

const baseURLTplBEDev = "http://127.0.0.1:" + process.env.SERVER_PORT + "/api";
const baseURLTplBEProd = "TODO";


module.exports = class ApiClient {

    constructor(env, end, options) {

        this.env = env.toLowerCase();

        this.runningRequests = 0;

        if(end === 'FE') {
            const rawSession = localStorage.getItem('nseSession')

            if (rawSession)
                this.session = JSON.parse(rawSession);
        }

        this.baseURL = end === 'FE' ? env === 'production' ? baseURLTplFEProd : baseURLTplFEDev : env === 'production' ? baseURLTplBEProd : baseURLTplBEDev;

        this.end = end;

        this.global401ErrorManager = options && options.global401ErrorManager ? options.global401ErrorManager : null;
        this.global403ErrorManager = options && options.global403ErrorManager ? options.global403ErrorManager : null;
        this.global500ErrorManager = options && options.global500ErrorManager ? options.global500ErrorManager : null;

        //API METHODS
        this.Status = (new RestInterface(this, null, '/v1/status')).setPublic({create: true});
        this.Users = new RestInterface(this, '/v1/users', '/v1/users/{0}');
        this.Auth = {
            Login: (new RestInterface(this, '/v1/auth/login')).setPublic({create: false}),
            Logout: new RestInterface(this, '/v1/auth/logout')
        };
        this.Flows = new RestInterface(this, '/v1/flows', '/v1/flows/{0}', '/v1/flows/{0}', '/v1/flows', '/v1/flows/{0}');


        this.Tools = {
            SendEmailFromFlow: new RestInterface(this, '/v1/tools/send-email-from-flow'),
            SendWebhookFromFlow: new RestInterface(this, '/v1/tools/send-webhook-from-flow'),
            SendTelegramMessageFromFlow: new RestInterface(this, '/v1/tools/send-telegram-message-from-flow'),
            GetNearPriceFromFlow: new RestInterface(this, null, '/v1/tools/get-near-price-from-flow')
        };

        this.Checkout = new RestInterface(this, '/v1/checkout');

    };

    setSession(session) {

        if(!session){
            this.session = null;
            return this.end === 'FE' && localStorage.removeItem('nseSession');
        }

        this.session = session;
        this.end === 'FE' && localStorage.setItem('nseSession', JSON.stringify(session));

    }

    getSession() {
        return this.session;
    }

    async makeRequest(endpoint, method, payload, isPublic) {

        const me = this;

        this.runningRequests++;

        try {

            const query = (method === 'GET' && payload ? '?' + me._serialize(payload) : '')
            const url = me.baseURL + endpoint + query;

            const response = await axios({
                headers: me._getHeaders(!isPublic),
                url,
                method,
                data: payload,
                timeout: 15000
            });

            this.runningRequests--;

            if (!response.data || response.data.error)
                return Promise.reject();

            if (this.end === 'FE' && method === 'POST' && (endpoint === '/v1/auth/login' || endpoint === '/v1/users') ) {
                this.setSession(response.data.data);
            } else if (this.end === 'FE' && endpoint === '/v1/auth/logout' && method === 'POST') {
                this.setSession(null);
            }

            return response.data;
        } catch (error) {

            this.runningRequests--;

            console.log(error);

            if(error.response.status === 401 && this.global401ErrorManager) {

                return this.global401ErrorManager(()=> me.makeRequest(endpoint, method, payload, isPublic));

            }

            error.response.status === 403 && this.global403ErrorManager && this.global403ErrorManager(error.response.data);
            error.response.status === 429 && this.global403ErrorManager && this.global403ErrorManager({ message: "Too many calls, please wait and try again later" });
            error.response.status === 500 && this.global500ErrorManager && this.global500ErrorManager();

            return Promise.reject(error.response ? error.response.data : error);
        }

    };

    _serialize(obj) {
        const str = [];

        for (let p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }

        return str.join("&");
    }

    _getHeaders(privateHeaders = false) {

        const headers = {};

        headers['Content-Type'] = 'application/json';

        headers['timestamp'] = (Math.floor(new Date().getTime() / 1000) - 10).toString();

        if (privateHeaders)
            headers['x-auth-token'] = this.getSession() && this.getSession().token ? this.getSession().token : null;

        return headers;

    }

};