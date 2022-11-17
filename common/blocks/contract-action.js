const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../lib/litegraph");


class ContractAction extends AbstractBlock {

    static title = "Contract Action";
    static desc = "Triggers when a something happens to a contract/account";
    static menu = "Contract/Contract Action";

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
            "Account",
            "",
            value => { this.properties['name'] = value });

    }


    onConfigure() {
        this.nameWidget.value = this.properties['name'] ? this.properties['name'] : "";
    }


    async onAdded() {

        const totalLikeMe = this.graph._nodes.reduce((acum, current) => current instanceof ContractAction ? acum + 1 : 0, 0);

        if(totalLikeMe === 1)
            return;

        this.error("Only one Contract Actions block can be added by flow");
        this.graph.remove(this);


    }

    triggerEvent(data) {
        console.log("Near block trigger", data);

        this.setOutputData(1, data.args.gas);
        this.setOutputData(2, data.args.deposit);
        this.setOutputData(3, data.fromAccount);
        this.setOutputData(4, data.actionKind);
        this.setOutputData(5, data.args.method_name);
        this.setOutputData(6, data.args.args_json);

        this.triggerSlot(0);
    }

}

module.exports = ContractAction;

