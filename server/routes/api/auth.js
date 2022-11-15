const express                   = require('express');
const authCtrl                  = require('../../controllers/auth');
const rateLimiter               = require('../../middlewares/rate-limiter');
const { RateLimiterMongo }      = require('rate-limiter-flexible');

const router = express.Router();

const loginRates = new RateLimiterMongo({
    storeClient: require('mongoose').connection,
    keyPrefix: 'rateLimitsLogin',
    points: 1,
    duration: 3, // per 1 second by IP
});

router.post('/auth/login', rateLimiter.getMiddleware(loginRates), authCtrl.login);
router.post('/auth/logout', authCtrl.logout);

module.exports = router;