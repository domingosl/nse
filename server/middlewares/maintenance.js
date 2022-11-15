module.exports = (req, res, next) => {

    const m = utilities.state.get('maintenance');

    if(!m)
        return next();

    res.unavailable("The API is under maintenance, please try later.");

};