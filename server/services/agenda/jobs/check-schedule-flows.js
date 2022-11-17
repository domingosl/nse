const moment = require('moment');

const Flows = require('../../../models/flows');

const tagLabel = 'checkScheduleFlowsJob';

module.exports = agenda => {

    agenda.define('check schedule flows', async job => {
        utilities.logger.info('Running JOB', { tagLabel });

        const lookupDate = moment().startOf('hour').toDate();

        utilities.logger.debug('Checking flows with schedules', { tagLabel, lookupDate });

        const flows = await Flows.find({ status: 'active', 'nextCronEvent.date': lookupDate }).lean();

        utilities.logger.debug('Found flows', { tagLabel, number: flows.length });

        for(let f = 0; f < flows.length; f++) {
            await agenda.now('execute flow', { flowId: flows[f]._id, trigger: 'schedule' });
        }


    });


    agenda.every('1 * * * *', 'check schedule flows');

    utilities.logger.info('Job declared', { tagLabel });

};