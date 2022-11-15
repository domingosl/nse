const fs              = require('fs');
const appRoot         = require('app-root-path').path;

const clientAuth      = require('../middlewares/client-auth')

module.exports = async api => {

    api.use(clientAuth);
    fs.readdirSync(`${appRoot}/server/routes/api`).map(file => {
        api.use("/api/v1/", require('./api/' + file));
    });


};