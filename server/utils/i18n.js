const appRoot = require('app-root-path').path;

global.i18n = require("i18n");

global.i18n.configure({
    locales:['en'],
    defaultLocale: 'en',
    directory: appRoot + '/server/locales',
    updateFiles: !!(process.env.I18N_UPDATE_FILES && process.env.I18N_UPDATE_FILES === 'true')
});