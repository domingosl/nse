const LiteGraph = require('../lib/litegraph');
const AbstractTimeBlock = require('./abstract-time-block');
const moment = require('moment');

class Daily extends AbstractTimeBlock {

    static title = "Daily schedule";
    static desc = "Fires an event every day at a selected hour";
    static menu = "Schedule/Daily";

    constructor() {
        super();

        this.addOutput('trigger', LiteGraph.EVENT);

        this.addProperty('atHour', 0);
        this.addProperty('fromDate', moment().format('YYYY-MM-DD'));
        this.addProperty('utcOffset', moment().utcOffset());

        this.atHourWidget = this.addWidget(
            "combo",
            "At hour (24h)",
            0,
            value => this.properties['atHour'] = value,
            {values: Array.from(Array(24).keys())});

        this.addWidget("space");

        this.startFromWidget = this.addWidget("date", "Start from", moment().format('YYYY-MM-DD'), value => this.properties['fromDate'] = value);


        this.size = [200, 120];

    }

    onConfigure() {

        this.atHourWidget.value = this.properties['atHour'];

        this.startFromWidget.value = this.properties['fromDate'];
    }




}

module.exports = Daily;