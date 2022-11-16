const Flows = require('../../models/flows');
const postman = require('../../services/postman');

const tagLabel = 'sendEmailFromFlow';

module.exports = async (req, res) => {

    try {

        const flow = await Flows.findOne({ _id: req.body.flowId, owner: req.locals.user._id });

        if(!flow)
            return res.forbidden("Cannot send email");

        await postman.mailer.to(req.body.name, req.body.email)
            .setSubject('Notification from flow')
            .setTemplate("8")
            .setParams({
                flowName: flow.name,
                message: req.body.message
            }).send();

        res.resolve();

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};