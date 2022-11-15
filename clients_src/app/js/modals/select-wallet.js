const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');
const createWalletModal = require('../../js/modals/create-wallet');


module.exports.show = async (cb) => {

    blockingLoader.show();
    const wallets = await apiClient.Wallets.list().execute();


    const formatWallets = wallets.data.reduce((result, wallet) => {
        result[wallet._id] = wallet.meta.title;
        return result;
    }, {});

    blockingLoader.hide();

    const {value: walletId} = await Swal.fire({
        title: 'Select your wallet',
        html: 'Select one of the above wallets or create a <a href="#" id="new-wallet-from-select-wallet-modal">new wallet</a>',
        input: 'select',
        inputOptions: formatWallets,
        inputPlaceholder: 'Select a wallet',
        showCancelButton: true,
        didRender: () => {

            Swal.getPopup().querySelector('#new-wallet-from-select-wallet-modal').addEventListener('click', async () => {

                const response = await createWalletModal.show();
                cb(response.value);

            })

        },
        willClose: ()=> typeof cb === 'function' && cb(null)
    });

    typeof cb === 'function' && cb(wallets.data.find(wallet => wallet._id === walletId));

};
