const LiteGraph = require('../lib/litegraph');
const AbstractBlock = require('./abstract-block');
const moment = require('moment');
const maxLogEntries = 10;

class LogEvent extends AbstractBlock {

    static title = "Log on trigger";
    static desc = "Logs a value on trigger. Log entries are stored in the node, " +
        "so if you want to persist them or clear them, remember to save the flow. A maximum of " + maxLogEntries + " entries " +
        "can be stored.";
    static menu = "Debug/Log on trigger";

    constructor() {
        super();

        this.uuid = "logbox-" + Math.floor(Math.random() * 999999999);


        this.addProperty("logs", []);

        this.addInput("trigger", LiteGraph.ACTION);
        this.addInput("value", 0);

    }

    onExecute() {
        //console.log(this.properties);
    }

    onAction(action, param) {

        const data =  this.getInputData(1);

        this.addLogEntry(data);

        console.log("Log event on trigger", data);

        //Running on BE
        if(typeof document === 'undefined')
            return;

        this.displayLogs();
    };

    addLogEntry(data) {

        this.properties['logs'].push({time: moment().format("DD/MM/YYYY hh:mm:ss"), data: JSON.stringify(data) });
        if(this.properties['logs'].length > maxLogEntries)
            this.properties['logs'].shift();

    }

    displayLogs() {

        const el = document.getElementById(this.uuid);

        if(!el)
            return;

        el.value = this.properties['logs'].reduce((prev, cur)=> prev + "[" + cur.time + "]: " + cur.data + "\n", "");

        el.scrollTop = el.scrollHeight;
    }

    clearLogs() {
        const el = document.getElementById(this.uuid);

        if(!el)
            return;

        this.properties["logs"] = [];

        el.value = "";

        el.scrollTop = el.scrollHeight;
    }

    async onShowCustomPanelInfo(panel) {

        const clearLogId = "clear-logs-" + this.uuid;

        panel.addHTML("<h2>Events logs <small>(<a href='#' id='" + clearLogId + "'>clear node logs</a>)</small></h2><textarea id=\"" + this.uuid + "\" readonly></textarea>");

        await this.yield();

        this.displayLogs();

        const clearLogEl = document.getElementById(clearLogId);

        clearLogEl.addEventListener('click', ()=> {
            this.clearLogs();
        });

    }


}


module.exports = LogEvent;