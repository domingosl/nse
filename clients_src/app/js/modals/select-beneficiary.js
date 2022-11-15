const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');
const createBeneficiary = require('../../js/modals/create-beneficiary');


module.exports.show = async (cb) => {

    blockingLoader.show();
    const beneficiaries = await apiClient.Payouts.Beneficiaries.list().execute();


    const formatBeneficiaries = beneficiaries.data.reduce((result, beneficiary) => {
        result[beneficiary._id] = (beneficiary.entityType === 'company' ? beneficiary.companyName : beneficiary.firstname ) + " (" + beneficiary.iban + ")";
        return result;
    }, {});

    blockingLoader.hide();

    const {value: beneficiaryId} = await Swal.fire({
        title: 'Select your beneficiary',
        html: 'Select one of the beneficiaries or create a <a href="#" id="new-beneficiary-from-select-beneficiary-modal">new beneficiary</a>',
        input: 'select',
        inputOptions: formatBeneficiaries,
        inputPlaceholder: 'Select a beneficiary',
        showCancelButton: true,
        didRender: () => {

            Swal.getPopup().querySelector('#new-beneficiary-from-select-beneficiary-modal').addEventListener('click', async () => {

                const response = await createBeneficiary.show();
                cb(response.value);

            })

        },
        willClose: ()=> typeof cb === 'function' && cb(null)
    });

    typeof cb === 'function' && cb(beneficiaries.data.find(beneficiary => beneficiary._id === beneficiaryId));

};
