const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');

module.exports.show = async () => {


    return await Swal.fire({
        title: 'New Beneficiary',
        html: `<form id="new-beneficiary-form">
        <p>Is the owner a person or a business?</p>
      <input type="radio" id="personal-beneficiary" name="entityType" value="individual" checked>
      <label for="personal-beneficiary">Person</label>
      <input type="radio" id="company-beneficiary" name="entityType" value="company">
      <label for="company-beneficiary">Business</label>
      <hr />
      
      <div id="beneficiary-individual-data">
        <input type="text" name="firstname" class="swal2-input" placeholder="Account owner first name">
        <label class="form-error" data-error="firstname"></label>
      
        <input type="text" name="surname" class="swal2-input" placeholder="Account owner surname">
        <label class="form-error" data-error="surname"></label>
        
        <input type="date" name="birthday" id="user-birthday" class="swal2-input" placeholder="Birthday&nbsp;">
        <label class="form-error" data-error="contact.birthday"></label>
      </div>
      
      <div id="beneficiary-company-data">
        <input type="text" name="companyName" class="swal2-input" placeholder="Account company name">
        <label class="form-error" data-error="companyName"></label>
      </div>
      
      <input type="text" name="address" class="swal2-input" placeholder="Address">
      <label class="form-error" data-error="address"></label>
      
      <input type="text" name="city" class="swal2-input" placeholder="City">
      <label class="form-error" data-error="city"></label>
      
      <select name="country" class="swal2-input">
          <option value="" disabled selected>Country</option>
          <option value="IT">Italy</option>
          <option value="DE">Germany</option>
          <option value="ES">Spain</option>
          <option value="FR">France</option>
          <option value="LU">Luxemburg</option>
          <option value="PT">Portugal</option>
          <option value="IE">Ireland</option>
      </select>
      <label class="form-error" data-error="country"></label>
      
      <input type="text" name="iban" class="swal2-input" placeholder="IBAN / Bank account">
      <label class="form-error" data-error="iban"></label>
      
      <input type="hidden" name="category" value="bank">
      
      </form>
    `,
        confirmButtonText: 'Save Beneficiary',
        focusConfirm: false,
        didRender() {

            const individualDataBlock = Swal.getPopup().querySelector('#beneficiary-individual-data');
            const companyDataBlock = Swal.getPopup().querySelector('#beneficiary-company-data');

            companyDataBlock.style.display = 'none';

            const radios = Swal.getPopup().querySelectorAll('input[type=radio][name="entityType"]');


            Array.prototype.forEach.call(radios, function(radio) {
                radio.addEventListener('change', function (event) {
                    if(this.value === 'individual') {
                        individualDataBlock.style.display = 'block';
                        companyDataBlock.style.display = 'none';
                    }
                    else if(this.value === 'company') {
                        individualDataBlock.style.display = 'none';
                        companyDataBlock.style.display = 'block';
                    }
                });
            });

            Swal.getPopup().querySelector('#user-birthday').addEventListener('change', function () {
                this.className=(this.value!=''?'swal2-input has-value':'');
            });

        },
        preConfirm: async () => {

            blockingLoader.show();

            const formData = new FormData(Swal.getPopup().querySelector('#new-beneficiary-form'));

            const payload = {
                entityType: formData.get('entityType'),
                iban: formData.get('iban'),
                category: formData.get('category'),
                firstname: formData.get('firstname') ? formData.get('firstname') : null,
                surname: formData.get('surname') ? formData.get('surname') : null,
                address: formData.get('address'),
                country: formData.get('country'),
                companyName: formData.get('companyName') ? formData.get('companyName') : null,
                city: formData.get('city'),
                birthday: formData.get('birthday'),
            };

            Swal.getPopup()
                .querySelectorAll("[data-error]")
                .forEach(errEl => errEl.innerText = "")

            let response;

            try {
                response = await apiClient.Payouts.Beneficiaries.create(payload).execute();

                blockingLoader.hide();
                return response.data;
            } catch (error) {

                if (error.code === 400) {
                    Swal.getPopup()
                        .querySelectorAll("[data-error]")
                        .forEach(errEl => errEl.innerText = error.data[errEl.getAttribute('data-error')] || "")
                }

                blockingLoader.hide();

                return false;
            }


        }
    });


};
