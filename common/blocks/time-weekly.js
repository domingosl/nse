const LiteGraph = require('../lib/litegraph');
const AbstractTimeBlock = require('./abstract-time-block');
const moment = require('moment');

class Weekly extends AbstractTimeBlock {

    static title = "Weekly schedule";
    static desc = "Fires an event every selected day of the week at a selected hour";
    static menu = "Schedule/Weekly";

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

        this.sundayWidget = this.addWidget("toggle", "Sunday", false, value => this.properties['sunday'] = value, {on: " ", off: " "});
        this.mondayWidget = this.addWidget("toggle", "Monday", false, value => this.properties['monday'] = value, {on: " ", off: " "});
        this.tuesdayWidget = this.addWidget("toggle", "Tuesday", false, value => this.properties['tuesday'] = value, {on: " ", off: " "});
        this.wednesdayWidget = this.addWidget("toggle", "Wednesday", false, value => this.properties['wednesday'] = value, {on: " ", off: " "});
        this.thursdayWidget = this.addWidget("toggle", "Thursday", false, value => this.properties['thursday'] = value, {on: " ", off: " "});
        this.fridayWidget = this.addWidget("toggle", "Friday", false, value => this.properties['friday'] = value, {on: " ", off: " "});
        this.saturdayWidget = this.addWidget("toggle", "Saturday", false, value => this.properties['saturday'] = value, {on: " ", off: " "});

        this.addWidget("space");

        this.startFromWidget = this.addWidget("date", "Start from", moment().format('YYYY-MM-DD'), value => this.properties['fromDate'] = value);


        this.size = [200, 300];

    }

    onConfigure() {

        this.atHourWidget.value = this.properties['atHour'];

        this.sundayWidget.value = this.properties['sunday'];
        this.mondayWidget.value = this.properties['monday'];
        this.tuesdayWidget.value = this.properties['tuesday'];
        this.wednesdayWidget.value = this.properties['wednesday'];
        this.thursdayWidget.value = this.properties['thursday'];
        this.fridayWidget.value = this.properties['friday'];
        this.saturdayWidget.value = this.properties['saturday'];

        this.startFromWidget.value = this.properties['fromDate'];
    }




}

module.exports = Weekly;