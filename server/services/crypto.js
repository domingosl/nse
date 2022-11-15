if (!process.env.CRYPTO_SERVICE_SECRET)
    throw new Error('A CRYPTO_SERVICE_SECRET must be defined in .env');

const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = process.env.CRYPTO_SERVICE_SECRET;
const iv = crypto.randomBytes(16);

const tagLabel = "cryptoUtil";

const encrypt = (text) => {

    try {

        if (!text)
            return "";

        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return iv.toString('hex') + "|" + encrypted.toString('hex');
    } catch (error) {
        utilities.logger.error("Error while encrypting", {tagLabel, error});
    }
};

const decrypt = (rawString) => {

    try {
        if (!rawString)
            return "";

        const hash = {
            iv: (rawString.split("|"))[0],
            content: (rawString.split("|"))[1]
        };

        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

        return decrpyted.toString();

    } catch (error) {
        utilities.logger.error("Error while decrypting", {tagLabel, error});
    }

};

module.exports = {
    encrypt,
    decrypt
};