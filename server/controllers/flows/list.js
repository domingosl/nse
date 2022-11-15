const Flows = require('../../models/flows');

const tagLabel = 'listFlows';

module.exports = async (req, res) => {

    try {

        const flows = await Flows.find({ owner: req.locals.user._id });

        res.resolve(flows);

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};