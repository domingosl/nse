require('dotenv').config();

const mongoose          = require('mongoose');
const mongooseApiError  = require('./mongoose-api-error');
mongoose.Promise = global.Promise;
mongoose.plugin(mongooseApiError);
mongoose.set('useCreateIndex', true);

const connection = mongoose.connect(process.env.DB_SERVER, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

module.exports = connection;