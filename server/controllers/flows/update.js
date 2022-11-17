const Flows = require('../../models/flows');

const tagLabel = 'updateFlow';

module.exports = async (req, res) => {

    try {

        const flow = await Flows.findOne({ _id: req.params.id, owner: req.locals.user._id });

        if(!flow)
            return res.notFound();

        flow.title = req.body.title || flow.title;
        flow.description = req.body.description || flow.description;
        flow.logic = req.body.logic || flow.logic;
        flow.status = req.body.status || flow.status;

        if(req.body.incomingUserWebhook)
            flow.incomingUserWebhook = req.body.incomingUserWebhook;


        flow.refreshSchedules();
        flow.refreshUserIncomingWebhook();
        flow.refreshNearActions();

        await flow.save();

        return res.resolve(flow);

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};