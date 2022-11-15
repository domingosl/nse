process.name = 'agendaWorker';

require('dotenv').config();

require('./server/utils/i18n');

const fs = require('fs');
const appRoot = require('app-root-path').path;
const agenda = require('./server/services/agenda');
const dbConn = require('./server/utils/db');

const tagLabel = process.name;

global.api = {
    config: require('./server/config')
};

global.imTheWorker = true;

global.utilities = require('@growishpay/service-utilities');


dbConn
    .then(async db => {

        utilities.logger.info(`Successfully connected to MongoDB cluster.`, {tagLabel});
        await loadAgenda();

        return db;

    })
    .catch(error => {

        utilities.logger.error('Error while attempting to connect to database.', {error, tagLabel});
        process.exit();

    });


process.on('SIGINT', async () => {

    utilities.logger.info('Gracefully stopping queue', {tagLabel});

    try {
        await agenda.stop();
    } catch (error) {
        utilities.logger.error('Cannot kill agenda', {tagLabel, error});
    }

    process.exit(0);

});

async function loadAgenda() {

    await agenda.start();

    fs.readdirSync(`${appRoot}/server/services/agenda/jobs`).map(file => {

        require(`${appRoot}/server/services/agenda/jobs/${file}`)(agenda);

    });

    try {
        process.send('ready');
    } catch (e) {
    }

}