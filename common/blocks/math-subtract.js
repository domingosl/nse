const AbstractBlock = require('./abstract-block');


class MathSubtract extends AbstractBlock {

    static title = "Subtract";
    static desc = "Subtracts 2 numbers";
    static menu = "Math/Subtract";

    constructor(props) {

        super(props);

        this.addInput("trigger", LiteGraph.ACTION);
        this.addInput("A", "number");
        this.addInput("B", "number");

        this.addOutput("trigger", LiteGraph.EVENT);
        this.addOutput('A-B', 'number');


        this.resizable = true;

    }


    async onAction(action, event) {

        const a = (parseFloat(this.getInputData(1)) || 0);
        const b = (parseFloat(this.getInputData(2)) || 0);

        this.setOutputData(0, a - b);

        this.triggerSlot(0, event);
    }

}

module.exports = MathSubtract;

