const basicAuth = require('basic-auth');
const tagLabel  = 'agendaAuthMiddleware';

module.exports = (req, res, next) => {

    const user = basicAuth(req);

    if(
        !user ||
        !process.env.AGENDA_DASHBOARD_USER ||
        !process.env.AGENDA_DASHBOARD_PASSWORD ||
        !(
            user.name === process.env.AGENDA_DASHBOARD_USER &&
            user.pass === process.env.AGENDA_DASHBOARD_PASSWORD
        )
    ) {

        utilities.logger.error('User failed to authenticate', {tagLabel, user});
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Node"');
        return res.end('Unauthorized');

    }

    next();

};