const tagLabel = 'logoutController';

module.exports = async (req, res) => {

    try {

        await req.locals.user.logout();
        await req.locals.user.save();

        res.resolve();

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};