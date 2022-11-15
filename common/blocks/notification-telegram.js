const AbstractBlock = require('./abstract-block');
const Modal = require('../../clients_src/app/js/modals/abstract');

class NotificationWebhook extends AbstractBlock {

    static title = "Telegram notification";
    static desc = "Sends a telegram message from the NSE Bot when triggered. You'll need a Chat Id to properly configure this node." +
        " To get one, search for @NearSmartEventsBot on Telegram or scan this QR code:<br /> <img class='qr' src='/_/telegram-bot-qr-code.png'/>";
    static menu = "Notification/Telegram";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('message (str)', 'string');

        this.addOutput('trigger', LiteGraph.EVENT);

        this.addProperty('chatId', "");


        this.addWidget('space');


        this.chatIdWidget = this.addWidget("text","Chat id", "", v => this.properties.chatId = v );

    }


    onConfigure() {

        this.chatIdWidget.value = this.properties['chatId'] || "";

    }


    async onAction() {

        if(!this.properties['chatId'])
            return this.error('Cannot send message: Missing Chat Id');


        const message = this.getInputData(1);

        if(!message)
            return this.error('Cannot send message: Missing message');

        const response = await this.graph.apiClient.Tools.SendTelegramMessageFromFlow.create({
            chatId: this.properties.chatId,
            message,
            flowId: this.graph.currentFlow._id,
        }).execute();

        this.triggerSlot(0, { timestamp: new Date().getTime() });

    }

}

module.exports = NotificationWebhook;

