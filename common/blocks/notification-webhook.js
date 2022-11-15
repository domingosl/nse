const AbstractBlock = require('./abstract-block');
const Modal = require('../../clients_src/app/js/modals/abstract');

class NotificationWebhook extends AbstractBlock {

    static title = "Webhook notification";
    static desc = "Sends a webhook when triggered";
    static menu = "Notification/Webhook";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('payload (obj)', 'object');

        this.addOutput('trigger', LiteGraph.EVENT);
        this.addOutput('response (string)', 'string');

        this.addProperty('url', "");
        this.addProperty('method', "GET");
        this.addProperty('contentType', "application/json");



        this.addWidget('space');


        this.urlWidget = this.addWidget("text","URL", "", v => this.properties.url = v );

        this.methodComboWidget = this.addWidget(
            "combo",
            "Method",
            "GET",
            value => this.properties['method'] = value,
            { values: ['GET', 'POST', 'PUT'] } );

        this.contentTypeComboWidget = this.addWidget(
            "combo",
            "Content-Type",
            "application/json",
            value => this.properties['contentType'] = value,
            { values: ['application/json'] } );

    }


    onConfigure() {

        this.urlWidget.value = this.properties['url'] || "";
        this.methodComboWidget.value = this.properties['method'] || "GET";
        this.contentTypeComboWidget.value = this.properties['contentType'] || "application/json";


    }


    async onAction() {

        if(!this.properties['url'])
            return this.error('Cannot send webhook: Missing URL');


        const response = await this.graph.apiClient.Tools.SendWebhookFromFlow.create({
            url: this.properties.url,
            method: this.properties.method,
            contentType: this.properties.contentType,
            flowId: this.graph.currentFlow._id,
            body: this.getInputData(1) || {}
        }).execute();

        this.triggerSlot(0, { timestamp: new Date().getTime() });
        this.setOutputData(1, JSON.stringify(response.data));

    }

}

module.exports = NotificationWebhook;

