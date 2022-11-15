const Users         = require('../models/users');
const unless        = require('express-unless');
const mongoose      = require('mongoose');
const jwt           = require('jsonwebtoken');

const tagLabel  = 'userAuthMiddleware';

const mw = async (req, res, next) => {

    try {

        let token = req.headers['x-auth-token'];

        if (typeof token !== 'string' || token === "")
            return res.unauthorized();

        const isJWT = !!token.match(/(^[\w-]*\.[\w-]*\.[\w-]*$)/);

        const userId = isJWT ? jwt.verify(token, process.env.JWT_SECRET).data : (token.split("-"))[0];

        if(!mongoose.isValidObjectId(userId))
            return res.unauthorized();

        const query = {_id: userId};

        const select = '+hashToken +hashPassword +sessionValidTill';

        const user = await Users.findOne(query).select(select);

        if (!user)
            return res.unauthorized();

        const isSessionValid = isJWT ? true : await user.isSessionValid(token);

        if (!isSessionValid)
            return res.unauthorized();

        req.locals.user = user;

        return next();
    }
    catch (error) {

        res.apiErrorResponse(error);
        utilities.logger.error('Cannot run client authentication', { tagLabel, error });

    }

};


module.exports = unless(mw, {path: api.config.publicRoutes});
