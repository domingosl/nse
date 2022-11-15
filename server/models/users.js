const mongoose = require('mongoose');
const validator = require('validator');
const publicFields = require("../plugins/public-fields");
const authCapable = require("../plugins/authentication-capable");

const UsersSchema = new mongoose.Schema({

        firstname: {
            type: String,
            minlength: [2, i18n.__('STRING_AT_LEAST', { min: 2 })],
            maxlength: [120, i18n.__('STRING_AT_MUST', { min: 120 })],
        },
        surname: {
            type: String,
            minlength: [2, i18n.__('STRING_AT_LEAST', { min: 2 })],
            maxlength: [120, i18n.__('STRING_AT_MUST', { min: 120 })],
        },
        email: {
            type: String,
            required: [true, i18n.__('FIELD_REQUIRED')],
            unique: [true, i18n.__('EMAIL_IS_NOT_UNIQUE')],
            validate: [ validator.isEmail, i18n.__('INVALID_EMAIL')]
        }

    },
    {collection: 'users', timestamps: true}
);

UsersSchema.plugin(authCapable);

UsersSchema.plugin(publicFields, [
    "_id",
    "firstname",
    "surname",
    "email",
]);


UsersSchema.pre('validate', function (next) {
    next();
});

module.exports = exports = mongoose.model('User', UsersSchema);
