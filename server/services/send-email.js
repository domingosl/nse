const axios = require('axios');


module.exports = async (name, email, subject, message) => {

    try {
        const payload = {
            sender: {
                name: 'DSE',
                email: 'info@nearsmartevents.com'
            },
            to: [{name, email}],
            params: this.params,
            subject,
            htmlContent: message
        };

        await axios({
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': process.env.SENDINBLUE_API_KEY
            },
            method: 'post',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            data: payload,
            timeout: 15000
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
};