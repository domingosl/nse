const LiteGraph = require('../../../common/lib/litegraph');
const Modal = require('./modals/abstract');
const blockingLoader = require('./blocking-loader');
const toast = require('./toast');

const Blocks = require('../../../common/blocks');

require('./bootstrap-api-client');

const Editor = require('./editor');

LiteGraph.Editor = Editor;

const flowId = document.getElementById('main-script').getAttribute('data-flow-id');

window.flowEditor = new LiteGraph.Editor(
    "main",
    {
        miniwindow: false,
        onSave: async function (exit = false) {
            blockingLoader.show();
            const data = JSON.stringify( flowEditor.graph.serialize() );
            await apiClient.Flows.update(flowId, { logic: data }).execute();
            blockingLoader.hide();

            if(!exit)
                Modal.Toast("success", "Flow saved!");
            else
                window.location.href = "/app/list-flows.html";
        },
        onFlowStatus: async function(status) {

            blockingLoader.show();

            const data = JSON.stringify( flowEditor.graph.serialize() );
            await apiClient.Flows.update(flowId, { logic: data, status }).execute();
            blockingLoader.hide();

            if(status === 'active')
                Modal.Toast("success", "The flow is now active, any events or schedules will be managed by NSE servers now", 5000);
            else if(status === 'inactive')
                Modal.Toast("success", "The flow is now deactivated, no events or schedules will be process", 5000);
        },
        onExit: () => window.location.href = '/app/list-flows.html'
    }, apiClient, toast);

flowEditor.graphcanvas.render_canvas_border = false;

window.addEventListener("resize", function() { flowEditor.graphcanvas.resize(); } );

//enable scripting
LiteGraph.allow_scripts = false;
flowEditor.graphcanvas.show_info = false;
flowEditor.graphcanvas.allow_searchbox = false;

Object.keys(Blocks).forEach(blockName => {
    LiteGraph.registerNodeType(Blocks[blockName].menu, Blocks[blockName]);
});



const loadFlow = async () => {

    const response = await apiClient.Flows.read(flowId).execute();

    flowEditor.graph.configure(JSON.parse(response.data.logic));
    document.getElementById('flow-title').innerText = response.data.name;
    flowEditor.graph.currentFlow = response.data;

    blockingLoader.hide();

    if(response.data.status === 'active')
        Modal.Toast("warning", "You are editing an active flow! Backend triggers can " +
            "override your local work. Please deactivate the flow before continuing.", 20000);

    flowEditor.graph.start();
}

blockingLoader.show();
loadFlow();

window.flowEditor = flowEditor;
/*const foo = require('./modals/create-user');
foo.show();*/
