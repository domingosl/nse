require('./bootstrap-api-client');

async function go() {
    await require('../js/modals/login').show(false);
    window.location.href = "/app/list-flows.html";
}

go();