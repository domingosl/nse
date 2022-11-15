module.exports.getMiddleware = (limiter) => (req, res, next) => {

    limiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });

};