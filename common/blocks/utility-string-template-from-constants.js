const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../lib/litegraph");


class UtilityStringFromConstTemplate extends AbstractBlock {

    static title = "Text template from Const";
    static desc = "Given a text and some constants ({a}, {b}, {c}), the block will replace occurrences of those constants in the text\n" +
        "For example: {a} = \"world\" and Text = \"Hello {a}\", will output \"Hello world\"";
    static menu = "String/Template from Const";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('{a}', '');
        this.addInput('{b}', '');
        this.addInput('{c}', '');

        this.addOutput('trigger', LiteGraph.EVENT);
        this.addOutput('text (str)', 'string');

        this.addProperty('string', "");


        this.resizable = true;

        this.addWidget("space");

        this.textWidget = this.addWidget(
            "text",
            "Template",
            "",
            value => { this.properties['string'] = value }, { multiline:true });

    }


    onConfigure() {

        this.textWidget.value = this.properties['string']  ? this.properties['string'] : "";

    }

    async onAction(action, event) {


        const a = this.getInputData(1) || "";
        const b = this.getInputData(2) || "";
        const c = this.getInputData(3) || "";

        const tplObj = {a, b, c};

        this.setOutputData(1, this.doTemplate(this.properties['string'], tplObj));
        this.triggerSlot(0, event);
    }

    doTemplate(text, obj = {}) {
        return text.replace(/{(\w+)}/g, function (_, k) {
            return obj[k];
        });
    }

}

module.exports = UtilityStringFromConstTemplate;