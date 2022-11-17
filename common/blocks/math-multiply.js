const AbstractBlock = require('./abstract-block');


class MathMultiply extends AbstractBlock {

    static title = "Multiply";
    static desc = "Multiplies 2 numbers";
    static menu = "Math/Multiply";

    constructor(props) {

        super(props);


        this.addInput("trigger", LiteGraph.ACTION);
        this.addInput("A", "number");
        this.addInput("B", "number");

        this.addOutput("trigger", LiteGraph.EVENT);
        this.addOutput('AxB', 'number');


        this.resizable = true;

    }


    async onAction(action, event) {


        const a = (parseFloat(this.getInputData(1)) || 0);
        const b = (parseFloat(this.getInputData(2)) || 0);

        this.setOutputData(1, a * b);

        this.triggerSlot(0, event);
    }

}

module.exports = MathMultiply;

