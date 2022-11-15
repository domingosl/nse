const validator = require('validator');
const Users = require('../../models/users');

const tagLabel = 'loginController';

module.exports = async (req, res) => {

    try {

        if(!validator.isEmail(req.body.email + ''))
            return res.badRequest({ email: i18n.__('EMAIL_INVALID')});

        if(!Users.isPasswordStrong(req.body.password + ''))
            return res.forbidden(i18n.__('INVALID_LOGIN_CREDENTIALS'));


        const select = '+hashToken +hashPassword +sessionValidTill';

        const user = await Users.findOne({ email: req.body.email }).select(select);

        if(!user)
            return res.forbidden(i18n.__('INVALID_LOGIN_CREDENTIALS'));


        let session;

        try {
            session = await user.login(req.body.password);
        }
        catch (e) {
            return res.forbidden(i18n.__('INVALID_LOGIN_CREDENTIALS'));
        }

        await user.save();

        return res.resolve(session);

    }
    catch (error) {

        res.apiErrorResponse(error);
        utilities.logger.error('Cannot login user', { tagLabel, error });

    }

};