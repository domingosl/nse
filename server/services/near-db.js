const { Client } = require('pg');
const moment = require('moment');

const tagLabel = "nearDBService";

let client;

module.exports.init = () => {
    client = new Client({ connectionString: process.env.NEAR_POSTGRESS_URL });
    client.connect();
}

module.exports.query = query => new Promise((resolve, reject) => {
    //'SELECT * FROM action_receipt_actions WHERE receipt_receiver_account_id = \'dev-1667593106668-86393838398542\''
    client.query(query, (err, res) => {
        if(err)
            return reject(err);

        resolve(res.rows);
        //client.end()
    })

});

module.exports.getRecentActionsFromAccount = (account, interval = process.env.NEAR_INDEXER_CHECK_INTERVAL) => new Promise((resolve, reject) => {

    const fromTime = moment()
        .startOf('minute')
        .subtract(interval, 'minutes')
        .format('x') * 1000000; //Nanoseconds

    const query = "SELECT * FROM action_receipt_actions " +
        "WHERE receipt_receiver_account_id = '" + account + "' AND receipt_included_in_block_timestamp > " + fromTime + " " +
        "ORDER BY receipt_included_in_block_timestamp DESC";

    utilities.logger.debug("getRecentActionsFromAccount", { query, tagLabel });

    client.query(query, (err, res) => {

        if(err)
            return reject(err);

        resolve(res.rows);

    });


});