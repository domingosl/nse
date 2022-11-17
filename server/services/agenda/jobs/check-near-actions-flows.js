const Flows = require('../../../models/flows');
const NearActions = require('../../../models/near-actions');

const tagLabel = 'checkNearActionsFlowsJob';

const checkInterval = parseInt(process.env.NEAR_INDEXER_CHECK_INTERVAL);

module.exports = agenda => {

    agenda.define('check near actions flows', async job => {
        utilities.logger.info('Running JOB', {tagLabel});

        utilities.logger.debug('Checking flows with Near listeners', {tagLabel});

        const flows = await Flows.find({status: 'active', 'nearActions.active': true, 'nearActions.account': { $ne: null }}).lean();

        utilities.logger.debug('Found flows', {tagLabel, number: flows.length});


        for (const flow of flows) {

            const response = await nearDb.getRecentActionsFromAccount(flow.nearActions.account, checkInterval);

            if (response.length <= 0)
            {
                utilities.logger.debug("No new actions from chain", {tagLabel});
                continue;
            }

            for (const action of response) {

                if ((await NearActions.countDocuments( { receiptId: action.receipt_id, flow: flow._id })) > 0) {
                    utilities.logger.debug("Ignoring action, already processed", { tagLabel, receiptId: action.receipt_id });
                    continue;
                }

                await agenda.now('execute flow', {
                    flowId: flow._id,
                    trigger: 'nearAction',
                    data: {
                        receiptId: action.receipt_id,
                        actionKind: action.action_kind,
                        args: action.args,
                        fromAccount: action.receipt_predecessor_account_id
                    }
                })
            }


        }


    });


    agenda.every('*/' + String(checkInterval/1000) +' * * * *', 'check near actions flows');

    utilities.logger.info('Job declared', {tagLabel});

};