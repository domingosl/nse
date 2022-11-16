const axios = require('axios');

const defaultSender = {
    name: 'Final Frontier',
    email: process.env.SENDER_EMAIL
};

class Mailer {

    constructor(options) {

        this.sender = defaultSender;

    }


    to() {

        if(arguments.length === 2) {
            this.name = arguments[0];
            this.email = arguments[1];
        } else if(arguments.length === 1) {
            this.name = arguments[0].name;
            this.email = arguments[0].email;
        }

        return this;
    }

    setSubject(text) {

        this.subject = text;

        return this;

    }

    setTemplate(name) {
        this.template = name;
        return this;
    }

    setContent(html) {

        this.content = html;

        return this;

    }

    setParams(params) {

        this.params = params;
        return this;

    }


    async send() {


        const payload = {
            to: [{name: this.name, email: this.email}],
        };

        if (this.params)
            payload.params = this.params;

        if (this.subject)
            payload.subject = this.subject;

        if (this.template) {
            payload.templateId = parseInt(this.template);

            if (this.params) {
                payload.params = this.params;
            }

        } else if (this.content) {
            payload.htmlContent = this.content;
        }

        try {

            const response = await axios({
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': process.env.SENDINBLUE_API_KEY
                },
                method: 'post',
                url: 'https://api.sendinblue.com/v3/smtp/email',
                data: payload,
                timeout: 10000
            });

            return response.data;

        } catch (error) {
            utilities.logger.error(error);
        }

        this.name = null;
        this.email = null;
        this.subject = null;
        this.params = null;
        this.content = null;
        this.template = null;

    }

}

module.exports = Mailer;