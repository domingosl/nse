const AbstractBlock = require('./abstract-block');
const Modal = require('../../clients_src/app/js/modals/abstract');

class Email extends AbstractBlock {

    static title = "Email notification";
    static desc = "Send an email when triggered";
    static menu = "Notification/Email";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('message (str)', "string");


        this.addProperty('name', "");
        this.addProperty('email', "");
        this.addProperty('message', "");


        this.addWidget('space');


        this.nameWidget = this.addWidget("text","Recipient Name", "", v => this.properties.name = v );
        this.emailWidget = this.addWidget("text","Recipient Email", "", v =>  this.properties.email = v );

    }


    onConfigure() {

        this.nameWidget.value = this.properties.name;
        this.emailWidget.value = this.properties.email;

    }


    async onAction() {

        if(!this.properties['name'])
            return this.error('Cannot send email: Missing recipient name');
        else if(!this.properties['email'])
            return this.error('Cannot send email: Missing recipient email');
        else if(!this.getInputData(1))
            return this.error('Cannot send email: Missing message');
        else if(!this.properties['name'] || !this.properties['email'] || !this.getInputData(1))
            return;

        const response = await this.graph.apiClient.Tools.SendEmailFromFlow.create({
            email: this.properties.email,
            name: this.properties.name,
            message: this.getInputData(1),
            flowId: this.graph.currentFlow._id
        }).execute();

        this.triggerSlot(0, { timestamp: new Date().getTime() });

    }

}

module.exports = Email;

