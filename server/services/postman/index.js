const Mailer = require('./mailer');

module.exports = {
    get mailer() { return new Mailer }
};