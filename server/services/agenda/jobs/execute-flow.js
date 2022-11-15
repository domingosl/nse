const jwt = require('jsonwebtoken');

const Blocks = require('../../../../common/blocks');
const LiteGraph = require('../../../../common/lib/litegraph');
const ApiClient = require('../../../../common/services/api-client');

const Flows = require('../../../models/flows');

require('../../../models/users');
const {bool} = require("joi");

const tagLabel = 'executeFlowsJob';

Object.keys(Blocks).forEach(blockName => {
    LiteGraph.registerNodeType(Blocks[blockName].menu, Blocks[blockName]);
});


const wait = async (time) => new Promise(resolve => setTimeout(resolve, time));

const waitForCompletion = async (job, graph, iteration = 1) => {

    if(iteration >= 10)
        return Promise.reject('timeout');

    await job.touch();
    await wait(1000);

    let nodeBusy = false;
    for(let node of graph._nodes) {
        if(typeof node.busy === "boolean" && node.busy) {
            nodeBusy = true;
            break;
        }
    }

    //No API calls in waiting and no nodes are busy
    if(graph.apiClient.runningRequests === 0 && !nodeBusy)
        return Promise.resolve();

    return waitForCompletion(job, graph, iteration++);

};


module.exports = agenda => {

    agenda.define('execute flow', { concurrency: 5 }, async job => {
        utilities.logger.info('Running JOB', { tagLabel, data: job.attrs.data });

        let flow;

        try {

            flow = await Flows.findOne({_id: job.attrs.data.flowId}).populate('owner');

            if (!flow)
                return Promise.reject('Flow not found');

            const apiClient = new ApiClient(process.env.ENV, 'BE');

            apiClient.setSession({
                token: jwt.sign({
                    data: String(flow.owner._id)
                }, process.env.JWT_SECRET, {expiresIn: 60})
            });

            const graph = new LiteGraph.LGraph(null, apiClient);

            const logic = JSON.parse(flow.logic);

            graph.configure(logic);

            graph.currentFlow = flow;

            graph.logger = utilities.logger;

            graph.start();


            if (job.attrs.data.trigger === 'schedule') {

                for (let n = 0; n < flow.nextCronEvent.nodes.length; n++) {

                    const nodeId = flow.nextCronEvent.nodes[n];

                    const node = graph.getNodeById(nodeId);

                    setTimeout(() => node.triggerEvent(), 0);

                    await waitForCompletion(job, graph);

                    flow.refreshSchedules();

                }

            }
            else if(job.attrs.data.trigger === 'incomingUserWebhook') {


                const entryNodes = graph.findNodesByType('Network/Incoming Webhook');


                if(entryNodes.length >= 1) {

                    setTimeout(() => entryNodes[0].triggerEvent(0, job.attrs.data.body), 0);

                    await waitForCompletion(job, graph);

                }

            }
            else {
                return Promise.reject('Unknown trigger');
            }

            flow.lastExecution.completed = true;
            flow.lastExecution.date = new Date();

            //console.log(graph.serialize());

            flow.logic = JSON.stringify(graph.serialize());

            await flow.save();

            utilities.logger.debug("Flow completed", { tagLabel });
            return Promise.resolve();

        } catch (error) {

            if(flow) {

                flow.lastExecution.completed = true;
                flow.lastExecution.date = new Date();
                flow.refreshSchedules();
                await flow.save();

            }

            utilities.logger.error("Job crashed", {tagLabel, error});
            return Promise.reject('Job crashed');

        }

    });


    utilities.logger.info('Job declared', {tagLabel});

};