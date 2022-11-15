const _ = require('lodash');

module.exports = (schema, fields = []) => {


    schema.methods.getPublicFields = function () {

        fields = fields.concat(['updatedAt', 'createdAt']);

        return _.pick(this.toJSON(), fields);

    };

};