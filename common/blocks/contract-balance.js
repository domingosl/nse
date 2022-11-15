const LiteGraph = require('../lib/litegraph');
const AbstractBlock = require('./abstract-block');
const nearAPI = require("near-api-js");

const { connect } = nearAPI;

const connectionConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

const accountNameRegex = /[a-zA-Z0-9].+\.testnet/;

class ContractBalance extends AbstractBlock {

    static title = "Contract balance";
    static desc = "Reads balance from a contract/account";
    static menu = "Contract/Balance";


    constructor() {

        super();

        this.busy = false;


        this.addInput('trigger', LiteGraph.ACTION);

        this.addOutput('trigger', LiteGraph.EVENT);
        this.addOutput('Response (obj)', 'object');
        this.addOutput('Available (int)', 'number');
        this.addOutput('Staked (int)', 'number');
        this.addOutput('State Staked (int)', 'number');
        this.addOutput('Total (int)', 'number');

        this.addProperty('accountName', "");

        this.resizable = true;

        this.addWidget("space");

        this.accountNameWidget = this.addWidget(
            "string",
            "Account",
            "",
            value => { this.properties['accountName'] = value });


    }


    onConfigure() {
        this.accountNameWidget.value = this.properties['accountName']  ? this.properties['accountName'] : "";
    }

    async onAction(action, event) {

        if(this.busy)
            return this.error("Refused to trigger because it was working on a previous trigger");

        if(!accountNameRegex.test(this.properties['accountName']))
            return this.error("Incorrect account name format");

        this.busy = true;

        try {
            const nearConnection = await connect(connectionConfig);

            const account = await nearConnection.account(this.properties['accountName']);
            const response = await account.getAccountBalance();


            this.setOutputData(1, response);
            this.setOutputData(2, parseInt(response.available));
            this.setOutputData(3, parseInt(response.staked));
            this.setOutputData(4, parseInt(response.stateStaked));
            this.setOutputData(5, parseInt(response.total));


            this.triggerSlot(0, event);
            this.busy = false;
        }
        catch (error) {
            this.error(error.message || "Something went wrong, please check the logs");
            console.log(error);
            this.busy = false;
        }


    }

}

module.exports = ContractBalance;