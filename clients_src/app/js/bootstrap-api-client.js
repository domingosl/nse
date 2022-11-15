const ApiClient = require('../../../common/services/api-client');
const Modal = require('../js/modals/abstract');

const loginModal = require('./modals/login');
const blockingLoader = require('./blocking-loader');

window.apiClient = new ApiClient('development', 'FE', {
    global401ErrorManager: async (next) => {
        blockingLoader.hide();
        await loginModal.show();
        blockingLoader.show();
        const response = await next();
        blockingLoader.hide();
        return response;
    },
    global403ErrorManager: (error) => {
        Modal.Toast("error", error.message, 7000);
    },
    global500ErrorManager: () => {
        Modal.Toast("error", "The service is not available at the moment, please retry later", 7000);
    }
});