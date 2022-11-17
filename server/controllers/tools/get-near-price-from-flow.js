const axios = require('axios');
const Joi = require('joi');
const nearAPI = require("near-api-js");

const Flows = require('../../models/flows');


const { connect } = nearAPI;

const connectionConfig = {
    networkId: process.env.NEAR_NETWORK_URL,
    nodeUrl: process.env.NEAR_NODE_URL,
    walletUrl: process.env.NEAR_WALLET_URL,
    helperUrl: process.env.NEAR_HELPER_URL,
    explorerUrl: process.env.NEAR_EXPLORER_URL,
};

const bodySchema = Joi.object().keys(
    {
        flowId: Joi.string().required(),
        amount: Joi.number().required()
    });

const tagLabel = 'getNeatPriceFromFlow';

module.exports = async (req, res) => {

    try {

        const valid = bodySchema.validate(req.query);

        if (valid.error)
            return res.forbidden(valid.error.details[0].message);

        const flow = await Flows.findOne({ _id: req.query.flowId, owner: req.locals.user._id });

        if(!flow)
            return res.forbidden("Cannot get prices");

        const response = await axios({
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_KEY
            },
            method: 'GET',
            url: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=' + String(parseFloat(req.query.amount)) + '&id=6535'
        });

        const nearConnection = await connect(connectionConfig);
        const nearData = await nearConnection.connection.provider.gasPrice();

        res.resolve({
            near: {
                usd: response.data.data.quote.USD.price
            },
            gas: parseInt(nearData.gas_price)
        });

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};