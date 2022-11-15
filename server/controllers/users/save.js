const Users = require('../../models/users');

const tagLabel = 'saveUser';

module.exports = async (req, res) => {

    try {

        const payload = req.body;

        const password = payload.password;
        const repeatPassword = payload.repeatPassword;

        if(!Users.isPasswordStrong(password))
            return res.badRequest({
                password: i18n.__('FORM_PASSWORD_IS_WEAK')
            });

        if(password !== repeatPassword)
            return res.badRequest({
                repeatPassword: i18n.__('FORM_PASSWORDS_DO_NOT_MATCH')
            });

        if(await Users.findOne({email: payload.email }))
            return res.forbidden(i18n.__('EMAIL_IS_NOT_UNIQUE'));


        if(payload.invitationCode !== 'nse0001')
            return res.forbidden(i18n.__('INVALID_INVITATION_CODE'));

        const user = new Users(payload);

        await user.setPassword(password);

        await user.save();

        const session = await user.login(password);

        await user.save();

        res.resolve(session);


    } catch (error) {

        utilities.logger.error('Controller crash', {tagLabel, error});
        res.apiErrorResponse(error);

    }

};