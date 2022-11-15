const AbstractBlock = require('./abstract-block');
const Modal = require('../../clients_src/app/js/modals/abstract');

class Email extends AbstractBlock {

    static title = "Email notification";
    static desc = "Send an email when triggered";
    static menu = "Notification/Email";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('{a}', "");
        this.addInput('{b}', "");


        this.addProperty('name', "");
        this.addProperty('email', "");
        this.addProperty('message', "");


        this.addWidget('space');


        this.nameWidget = this.addWidget("text","Recipient Name", "", v => this.properties.name = v );
        this.emailWidget = this.addWidget("text","Recipient Email", "", v =>  this.properties.email = v );
        this.messageWidget = this.addWidget("text","Message", "", v => this.properties.message = v, { multiline:true } );

    }


    onConfigure() {

        this.nameWidget.value = this.properties.name;
        this.emailWidget.value = this.properties.email;
        this.messageWidget.value = this.properties.message;

    }


    async onAction() {

        if(!this.properties['name'] && typeof document === 'object')
            return this.error('Cannot send email: Missing recipient name');
        else if(!this.properties['email'] && typeof document === 'object')
            return this.error('Cannot send email: Missing recipient email');
        else if(!this.properties['message'] && typeof document === 'object')
            return this.error('Cannot send email: Missing message');
        else if(!this.properties['name'] || !this.properties['email'] || !this.properties['message'])
            return;

        const a = this.getInputData(1);
        const b = this.getInputData(2);

        const messageWithData = this.properties.message.replace('{a}', a).replace('{b}', b);

        const response = await this.graph.apiClient.Tools.SendEmailFromFlow.create({
            email: this.properties.email,
            name: this.properties.name,
            message: messageWithData,
            flowId: this.graph.currentFlow._id
        }).execute();

        this.triggerSlot(0, { timestamp: new Date().getTime() });

    }

}

module.exports = Email;

