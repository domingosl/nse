class AbstractBlock {

    constructor() {

    }


    info(message, time = 5000) {
        this.graph.logger("info", "<h1>" + this.type + " block</h1><br />" + message, time);
    }

    error(message, time = 5000) {
        this.graph.logger("error", "<h1>Error in " + this.type + " block</h1><br />" + message, time);
    }

    async yield(time = 0) {
        new Promise(resolve => setTimeout(resolve, time));
    }

}

module.exports = AbstractBlock;