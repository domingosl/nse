const Flows = require('../../models/flows');

const tagLabel = 'getFlow';

module.exports = async (req, res) => {

    try {

        const flow = await Flows.findOne({ _id: req.params.id, owner: req.locals.user._id });

        if(!flow)
            return res.notFound();

        res.resolve(flow);


    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};