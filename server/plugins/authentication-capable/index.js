const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const otp = require('./otp');


const tagLabel = 'authenticationCapablePlugin';

const rounds = 10;
const defaultSessionDuration = 30 * 24 * 3600; //30 days in seconds
//const defaultSessionDuration = 15 * 60; //15 minutes in seconds
//const defaultSessionDuration = 24 * 3600; //1 day in seconds
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\.#\$%\^&\*])(?=.{8,})/gm;
const resetPasswordProcessDuration = 15 * 60;


module.exports = (schema, options = {}) => {

    schema.add({
        hashPassword: {
            type: String,
            select: false
        },
        hashToken: {
            type: String,
            select: false
        },
        sessionValidTill: {
            type: Date,
            select: false
        },
        resetPassword: {
            otp: {
                type: String,
                select: false
            },
            validTill: {
                type: Date,
                select: false
            },
            createdAt: {
                type: Date,
                select: false
            },
            remainingAttempts: {
                type: Number,
                select: false
            }
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    });

    schema.methods.startResetPasswordProcess = function() {

        this.resetPassword = {
            otp: otp.generate(6, { specialChars: false, upperCase: false }),
            createdAt: moment(),
            validTill: moment().add(resetPasswordProcessDuration, 'seconds'),
            remainingAttempts: 3
        };

        return {
            createdAt: this.resetPassword.createdAt,
            validTill: this.resetPassword.validTill
        };

    };

    schema.statics.isPasswordStrong = (password) => !!passwordStrengthRegex.exec(password);

    schema.methods.isSessionValid = async function (token) {

        return this.hashToken && this.sessionValidTill && this.sessionValidTill > new Date() && await bcrypt.compare(token, this.hashToken);

    };

    schema.methods.setPassword = async function (rawPassword) {

        this.hashPassword = await bcrypt.hash(rawPassword, rounds);

    };

    schema.methods.isPasswordValid = async function (rawPassword) {

        if(!rawPassword) return false;

        return await bcrypt.compare(rawPassword, this.hashPassword);

    };

    schema.methods.login = async function (rawPassword, expirationTime = defaultSessionDuration) {

        if (!this.hashPassword)
            return Promise.reject();

        const validLogin = await bcrypt.compare(rawPassword, this.hashPassword);

        if (!validLogin)
            return Promise.reject();

        const token = this._id + "-" + uuidv4();

        this.sessionValidTill = moment().add(expirationTime, 'seconds');
        this.hashToken = await bcrypt.hashSync(token, 10);

        return Promise.resolve({ token, expireOn: this.sessionValidTill, isAdmin: this.isAdmin });

    };

    schema.methods.logout = async function () {

        this.hashToken = null;

    };

};