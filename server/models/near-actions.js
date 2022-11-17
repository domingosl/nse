const mongoose = require('mongoose');


const NearActionsSchema = new mongoose.Schema({

        receiptId: {
            type: String,
            required: true
        },
        flow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flow',
            required: true
        }

    },
    {collection: 'nearActions', timestamps: true}
);


module.exports = exports = mongoose.model('NearAction', NearActionsSchema);
