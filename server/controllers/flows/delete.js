const Flows = require('../../models/flows');

const tagLabel = 'deleteFlow';

module.exports = async (req, res) => {

    try {

        const flow = await Flows.findOne({ _id: req.params.id, owner: req.locals.user._id });

        if(!flow)
            return res.notFound();

        await flow.delete();

        res.resolve();


    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};