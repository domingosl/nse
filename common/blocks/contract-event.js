const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../lib/litegraph");


class ContractEvent extends AbstractBlock {

    static title = "Contract Event";
    static desc = "Triggers when a something happens to a contract/account";
    static menu = "Contract/Contract Event";

    constructor(props) {

        super(props);

        this.addOutput('trigger', LiteGraph.EVENT);


        this.addOutput('Gas (int)', 'number');
        this.addOutput('Deposit (int)', 'number');
        this.addOutput('From account (str)', 'string');
        this.addOutput('Action kind (str)', 'string');
        this.addOutput('Method name (str)', 'string');
        this.addOutput('Arguments (obj)', 'object');

        this.resizable = true;

        this.addWidget("space");

        this.nameWidget = this.addWidget(
            "string",
            "Account Name",
            "",
            value => { this.properties['name'] = value });

    }


    onConfigure() {
        this.nameWidget.value = this.properties['name'] ? this.properties['name'] : "";
    }


    async onAction(action, event) {

    }

}

module.exports = ContractEvent;

