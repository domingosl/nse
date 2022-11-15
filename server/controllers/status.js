const tagLabel = 'statusController';

module.exports = async (req, res) => {

    try {

        return res.resolve({
            localTime: new Date(),
            bootTime: utilities.state.get('APILastBootDate')
        });

    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};