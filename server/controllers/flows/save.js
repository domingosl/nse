const Flows = require('../../models/flows');

const tagLabel = 'saveFlow';

module.exports = async (req, res) => {

    try {

        const flow = new Flows({ ...req.body, owner: req.locals.user._id });

        await flow.save();

        res.resolve(flow);


    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};