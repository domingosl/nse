const AbstractBlock = require('./abstract-block');


class MathDivide extends AbstractBlock {

    static title = "Divide";
    static desc = "Divides 2 numbers";
    static menu = "Math/Divide";

    constructor(props) {

        super(props);

        this.addInput("trigger", LiteGraph.ACTION);
        this.addInput("A", "number");
        this.addInput("B", "number");

        this.addOutput("trigger", LiteGraph.EVENT);
        this.addOutput('A/B', 'number');


        this.resizable = true;

    }


    async onAction(action, event) {

        const a = (parseFloat(this.getInputData(1)) || 0);
        const b = (parseFloat(this.getInputData(2)) || 0);

        if(!b)
            return this.error("Can't dive by zero!");

        this.setOutputData(1, a / b);

        this.triggerSlot(0, event);
    }

}

module.exports = MathDivide;

