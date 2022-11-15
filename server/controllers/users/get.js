const tagLabel = 'getUser';

module.exports = async (req, res) => {

    try {

        res.resolve(req.locals.user);

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};