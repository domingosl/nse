const LiteGraph = require('../lib/litegraph');
const AbstractTimeBlock = require('./abstract-time-block');
const moment = require('moment');

class Weekly extends AbstractTimeBlock {

    static title = "Monthly schedule";
    static desc = "Fires an event every selected day of the month at a selected hour";
    static menu = "Schedule/Monthly";

    constructor() {
        super();

        this.addOutput('trigger', LiteGraph.EVENT);

        this.addProperty('atHour', 0);
        this.addProperty('atDayNumber', 1);
        this.addProperty('fromDate', moment().format('YYYY-MM-DD'));
        this.addProperty('utcOffset', moment().utcOffset());

        this.atHourWidget = this.addWidget(
            "combo",
            "At hour (24h)",
            0,
            value => this.properties['atHour'] = value,
            {values: Array.from(Array(24).keys())});

        this.addWidget("space");

        this.atDayNumberWidget = this.addWidget(
            "combo",
            "At Day",
            1,
            value => this.properties['atDayNumber'] = value,
            {values: Array.from({length: 31}, (_, i) => i + 1)});

        this.addWidget("space");

        this.januaryWidget = this.addWidget("toggle", "January", false, value => this.properties['january'] = value, {on: " ", off: " "});
        this.februaryWidget = this.addWidget("toggle", "February", false, value => this.properties['february'] = value, {on: " ", off: " "});
        this.marchWidget = this.addWidget("toggle", "March", false, value => this.properties['march'] = value, {on: " ", off: " "});
        this.aprilWidget = this.addWidget("toggle", "April", false, value => this.properties['april'] = value, {on: " ", off: " "});
        this.mayWidget = this.addWidget("toggle", "May", false, value => this.properties['may'] = value, {on: " ", off: " "});
        this.juneWidget = this.addWidget("toggle", "June", false, value => this.properties['june'] = value, {on: " ", off: " "});
        this.julyWidget = this.addWidget("toggle", "July", false, value => this.properties['july'] = value, {on: " ", off: " "});
        this.augustWidget = this.addWidget("toggle", "August", false, value => this.properties['august'] = value, {on: " ", off: " "});
        this.septemberWidget = this.addWidget("toggle", "September", false, value => this.properties['september'] = value, {on: " ", off: " "});
        this.octoberWidget = this.addWidget("toggle", "October", false, value => this.properties['october'] = value, {on: " ", off: " "});
        this.novemberWidget = this.addWidget("toggle", "November", false, value => this.properties['november'] = value, {on: " ", off: " "});
        this.decemberWidget = this.addWidget("toggle", "December", false, value => this.properties['december'] = value, {on: " ", off: " "});

        this.addWidget("space");

        this.startFromWidget = this.addWidget("date", "Start from", moment().format('YYYY-MM-DD'), value => this.properties['fromDate'] = value);


        //this.size = [200, 300];

    }

    onConfigure() {

        this.atHourWidget.value = this.properties['atHour'];
        this.atDayNumberWidget.value = this.properties['atDayNumber'];

        this.januaryWidget.value = this.properties['january'];
        this.februaryWidget.value = this.properties['february'];
        this.marchWidget.value = this.properties['march'];
        this.aprilWidget.value = this.properties['april'];
        this.mayWidget.value = this.properties['may'];
        this.juneWidget.value = this.properties['june'];
        this.julyWidget.value = this.properties['july'];
        this.augustWidget.value = this.properties['august'];
        this.septemberWidget.value = this.properties['september'];
        this.octoberWidget.value = this.properties['october'];
        this.novemberWidget.value = this.properties['november'];
        this.decemberWidget.value = this.properties['december'];

        this.startFromWidget.value = this.properties['fromDate'];
    }




}

module.exports = Weekly;