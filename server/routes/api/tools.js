const express                  = require('express');
const toolsCtrl                = require('../../controllers/tools');
const rateLimiter               = require('../../middlewares/rate-limiter');
const { RateLimiterMongo }      = require('rate-limiter-flexible');

const router = express.Router();

const emailRates = new RateLimiterMongo({
    storeClient: require('mongoose').connection,
    keyPrefix: 'rateLimitsEmailSend',
    points: 1,
    duration: 60,
});

const webhookRates = new RateLimiterMongo({
    storeClient: require('mongoose').connection,
    keyPrefix: 'rateLimitsWebhook',
    points: 1,
    duration: 10,
});

const telegramRates = new RateLimiterMongo({
    storeClient: require('mongoose').connection,
    keyPrefix: 'rateLimitsTelegram',
    points: 1,
    duration: 10,
});

const nearPriceRates = new RateLimiterMongo({
    storeClient: require('mongoose').connection,
    keyPrefix: 'nearPrice',
    points: 1,
    duration: 3,
});

router.post('/tools/send-email-from-flow', rateLimiter.getMiddleware(emailRates), toolsCtrl.sendEmailFromFlow);
router.post('/tools/send-webhook-from-flow', rateLimiter.getMiddleware(webhookRates), toolsCtrl.sendWebhookFromFlow);
router.post('/tools/send-telegram-message-from-flow', rateLimiter.getMiddleware(telegramRates), toolsCtrl.sendTelegramMessageFromFlow);
router.get('/tools/get-near-price-from-flow', rateLimiter.getMiddleware(nearPriceRates), toolsCtrl.getNearPriceFromFlow);

module.exports = router;