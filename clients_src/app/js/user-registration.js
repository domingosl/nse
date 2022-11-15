require('./bootstrap-api-client');

async function go() {
    await require('../js/modals/create-user').show(false);
    window.location.href = "/app/list-flows.html";
}

go();