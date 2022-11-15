const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../lib/litegraph");


class StringConcat extends AbstractBlock {

    static title = "Concat";
    static desc = "Concatenates 2 strings";
    static menu = "String/Concat";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('A (str)', 'string');
        this.addInput('B (str)', 'string');

        this.addOutput('trigger', LiteGraph.EVENT);
        this.addOutput('A + B (str)', 'string');

        this.resizable = true;


    }

    onAction(action, event) {

        this.setOutputData(1, String(this.getInputData(1)).concat(String(this.getInputData(2))));
        this.triggerSlot(0, event);
    }

}

module.exports = StringConcat;