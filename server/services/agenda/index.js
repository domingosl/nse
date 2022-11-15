const Agenda    = require('agenda');
const tagLabel  = 'agendaService';

const agenda = new Agenda({
    db: {
        address: process.env.DB_SERVER, collection: 'jobs',
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    }
});

agenda.on('fail', (err, job) => {

    utilities.logger.error('Job failed with error', {error: err.message, job: job.attrs.name, tagLabel});

});

module.exports = agenda;