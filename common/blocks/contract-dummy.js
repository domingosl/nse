const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../lib/litegraph");


class ContractDummy extends AbstractBlock {

    static title = "Contract Dummy";
    static desc = "Simulates a contract/account interaction, useful for debug and test";
    static menu = "Debug/Contract Dummy";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addOutput('trigger', LiteGraph.EVENT);


        this.addOutput('Gas (int)', 'number');
        this.addOutput('Deposit (int)', 'number');
        this.addOutput('From account (string)', 'string');
        this.addOutput('Action kind (string)', 'string');
        this.addOutput('Method name (string)', 'string');

        this.addProperty('gas', 0);
        this.addProperty('deposit', 0);
        this.addProperty('fromAccount', '');
        this.addProperty('actionKind', 'CREATE ACCOUNT');
        this.addProperty('methodName', '');


        this.resizable = true;

        this.addWidget("space");

        this.gasWidget = this.addWidget(
            "number",
            "Gas",
            0,
            value => { this.properties['gas'] = parseInt(value) }, {precision: 0});

        this.depositWidget = this.addWidget(
            "number",
            "Deposit",
            0,
            value => { this.properties['deposit'] = value }, {precision: 0});

        this.fromAccountWidget = this.addWidget(
            "string",
            "From Account",
            "",
            value => { this.properties['fromAccount'] = value });

        this.actionKindComboWidget = this.addWidget(
            "combo",
            "Action",
            "CREATE ACCOUNT",
            selectedOperator => this.properties['actionKind'] = selectedOperator,
            { values: [
                    'CREATE ACCOUNT',
                    'DEPLOY CONTRACT',
                    'FUNCTION CALL',
                    'TRANSFER',
                    'STAKE',
                    'ADD KEY',
                    'DELETE KEY',
                    'DELETE ACCOUNT'
                ]} );

        this.methodNameWidget = this.addWidget(
            "string",
            "Method Name",
            "",
            value => { this.properties['methodName'] = value });

    }


    onConfigure() {

        this.gasWidget.value = this.properties['gas']  ? this.properties['gas'] : 0;
        this.depositWidget.value = this.properties['deposit']  ? this.properties['deposit'] : 0;
        this.fromAccountWidget.value = this.properties['fromAccount']  ? this.properties['fromAccount'] : "";
        this.actionKindComboWidget.value = this.properties['actionKind'] ? this.properties['actionKind'] : "CREATE ACCOUNT";
        this.methodNameWidget.value = this.properties['methodName'] ? this.properties['methodName'] : "";

    }


    async onAction(action, event) {

        this.setOutputData(1, parseInt(this.properties['gas']));
        this.setOutputData(2, parseInt(this.properties['deposit']));
        this.setOutputData(3, this.properties['fromAccount']);
        this.setOutputData(4, this.properties['actionKind']);
        this.setOutputData(5, this.properties['methodName']);

        this.triggerSlot(0, event);


    }

}

module.exports = ContractDummy;

