const LiteGraph = require('../../../common/lib/litegraph');

//Creates an interface to access extra features from a graph (like play, stop, live, etc)
function Editor(container_id, options, apiClient, logger) {
    options = options || {};

    //fill container
    let html = `
<div class='header'>
    <div class='tools tools-left'>
        <h1 id='flow-title'></h1>
    </div>
    <div class='tools tools-right'>
        <label class="dropdown">
        
          <div class="dd-button">
            options
          </div>
        
          <input type="checkbox" class="dd-input" id="test">
        
          <ul class="dd-menu">
            <li>Save</li>
            <li>Save and Exit</li>
            <li>Activate Flow</li>
            <li>Deactivate Flow</li>
            <li>Exit without saving</li>
          </ul>
          
        </label>
    </div>
</div>`;
    html += "<div class='content'><div class='editor-area'><canvas class='graphcanvas' width='1000' height='500' tabindex=10></canvas></div></div>";

    const root = document.createElement("div");
    this.root = root;
    root.className = "litegraph litegraph-editor";
    root.innerHTML = html;

    this.content = root.querySelector(".content");

    let canvas = root.querySelector(".graphcanvas");

    //create graph
    const graph = (this.graph = new LiteGraph.LGraph(null, apiClient, logger));
    const graphcanvas = (this.graphcanvas = new LiteGraph.LGraphCanvas(canvas, graph));
    graphcanvas.background_image = "/_/grid.png";

    graph.onAfterExecute = function() {
        graphcanvas.draw(true);
    };

    //append to DOM
    const parent = document.getElementById(container_id);

    if (parent) {
        parent.appendChild(root);
    }

    graphcanvas.resize();

    const menuItems = root.querySelector('ul.dd-menu').querySelectorAll('li');

    menuItems[0].addEventListener('click', () => options.onSave());
    menuItems[1].addEventListener('click', () => options.onSave(true));
    menuItems[2].addEventListener('click', () => options.onFlowStatus('active'));
    menuItems[3].addEventListener('click', () => options.onFlowStatus('inactive'));
    menuItems[4].addEventListener('click', () => options.onExit());

}


module.exports = Editor;