const axios = require('axios');
const Joi = require('joi');

const Flows = require('../../models/flows');


const bodySchema = Joi.object().keys(
    {
        flowId: Joi.string().required(),
        url: Joi.string().uri().required(),
        method: Joi.string().valid('GET', 'POST', 'PUT').required(),
        body: Joi.object(),
        contentType: Joi.string().valid('application/json')
    });

const tagLabel = 'sendWebhookFromFlow';

module.exports = async (req, res) => {

    try {

        const flow = await Flows.findOne({ _id: req.body.flowId, owner: req.locals.user._id });

        if(!flow)
            return res.forbidden("Cannot send email");

        const valid = bodySchema.validate(req.body);

        if (valid.error)
            return res.forbidden(valid.error.details[0].message);

        let payload = undefined;

        if(req.body.method !== 'get' && typeof req.body.body === 'object')
            payload = req.body.body;

        const response = await axios({
            headers: {
                'accept': 'application/json',
                'Content-Type': req.body.contentType,
            },
            method: req.body.method,
            url: req.body.url,
            data: payload,
            timeout: 5000
        });

        res.resolve(response.data);

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};