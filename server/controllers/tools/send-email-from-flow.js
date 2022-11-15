const Flows = require('../../models/flows');
const sendEmailService = require('../../services/send-email');

const tagLabel = 'sendEmailFromFlow';

module.exports = async (req, res) => {

    try {

        const flow = await Flows.findOne({ _id: req.body.flowId, owner: req.locals.user._id });

        if(!flow)
            return res.forbidden("Cannot send email");

        await sendEmailService(req.body.name, req.body.email, "Notification from your flow: " + flow.name, req.body.message);

        res.resolve();

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};