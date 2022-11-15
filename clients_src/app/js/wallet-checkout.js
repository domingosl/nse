const blockingLoader = require('../js/blocking-loader');

const walletId = document.getElementById('main-script').getAttribute('data-wallet-id');

require('./bootstrap-api-client');

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

document.getElementById('payBtn').addEventListener('click', async () => {

    const amount = document.getElementById('amount').value;

    if(isNaN(amount) || amount<0)
        return;

    blockingLoader.show();

    try {

        const response = await apiClient.Checkout.create({
            amount,
            walletId,
            country: 'IT'
        }).execute();

        window.location.href = response.data.redirectUrl;

    }
    catch (error) {
        blockingLoader.hide();
    }

});

const amountInput = document.getElementById('amount');

setInputFilter(amountInput, function(value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});

async function load() {

    blockingLoader.show();
    const response = await apiClient.RPCGetPublicWallet.read(walletId).execute();

    document.getElementById('wallet-title').innerText = response.data.meta.title;
    document.getElementById('wallet-description').innerText = response.data.meta.description || "";
    document.getElementById('wallet-currency').innerText = response.data.currency;

    blockingLoader.hide();
    console.log(response);

}

load();