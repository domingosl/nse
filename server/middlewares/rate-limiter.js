module.exports.getMiddleware = (limiter) => (req, res, next) => {

    const uid = req.locals && req.locals.user ? req.locals.user._id : req.ip;

    limiter.consume(uid)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });

};