const AbstractBlock = require('./abstract-block');
const Modal = require('../../clients_src/app/js/modals/abstract');

class Email extends AbstractBlock {

    static title = "NEAR/USD";
    static desc = "Get prices of NEAR and GAS";
    static menu = "Utility/NEAR prices";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addOutput('trigger', LiteGraph.EVENT);
        this.addOutput('NEAR/USD (number)', 'number');
        this.addOutput('GAS (number)', 'number');

    }


    onConfigure() {

    }


    async onAction() {

        const response = await this.graph.apiClient.Tools.GetNearPriceFromFlow.read(null, {
            amount: 1,
            flowId: this.graph.currentFlow._id
        }, ).execute();

        this.setOutputData(1, response.data.near.usd);
        this.setOutputData(2, response.data.gas);
        this.triggerSlot(0, { timestamp: new Date().getTime() });

    }

}

module.exports = Email;

