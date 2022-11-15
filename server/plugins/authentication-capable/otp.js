const digits = '0123456789';
const alphabets = 'abcdefghjkmnpqrstuvwxyz';
const upperCase = alphabets.toUpperCase();
const specialChars = '#!&@';

function rand(min, max) {
    const random = Math.random();
    return Math.floor(random * (max - min) + min);
}

module.exports.generate = function (length, options) {

    length = length || 10;
    const generateOptions = options || {};

    generateOptions.digits = Object.prototype.hasOwnProperty.call(generateOptions, 'digits') ? options.digits : true;
    generateOptions.alphabets = Object.prototype.hasOwnProperty.call(generateOptions, 'alphabets') ? options.alphabets : true;
    generateOptions.upperCase = Object.prototype.hasOwnProperty.call(generateOptions, 'upperCase') ? options.upperCase : true;
    generateOptions.specialChars = Object.prototype.hasOwnProperty.call(generateOptions, 'specialChars') ? options.specialChars : true;

    const allowsChars = ((generateOptions.digits || '') && digits) +
        ((generateOptions.alphabets || '') && alphabets) +
        ((generateOptions.upperCase || '') && upperCase) +
        ((generateOptions.specialChars || '') && specialChars);

    let password = '';

    while (password.length < length) {
        const charIndex = rand(0, allowsChars.length - 1);
        password += allowsChars[charIndex];
    }

    return password;

};