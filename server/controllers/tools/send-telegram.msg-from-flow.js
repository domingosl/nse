const Joi = require('joi');

const notificationTelegramBot = require('../../services/notifications-telegram-bot');
const Flows = require('../../models/flows');


const bodySchema = Joi.object().keys(
    {
        flowId: Joi.string().required(),
        message: Joi.string().required().min(1).max(300),
        chatId: Joi.string().required().min(6).max(12),
    });

const tagLabel = 'sendTelegramMessageFromFlow';

module.exports = async (req, res) => {

    try {

        const flow = await Flows.findOne({ _id: req.body.flowId, owner: req.locals.user._id });

        if(!flow)
            return res.forbidden("Cannot send email");

        const valid = bodySchema.validate(req.body);

        if (valid.error)
            return res.forbidden(valid.error.details[0].message);


        notificationTelegramBot.sendMessage(req.body.chatId, req.body.message);

        res.resolve();

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};