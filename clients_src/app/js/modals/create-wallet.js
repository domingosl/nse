const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';


module.exports.show = async () => {

    let iti;

    return await Swal.fire({
        title: 'New Wallet',
        html: `<form id="new-wallet-form">
        <p>Is the owner a person or a business?</p>
      <input type="radio" id="personal-wallet" name="type" value="person" checked>
      <label for="personal-wallet">Person</label>
      <input type="radio" id="company-wallet" name="type" value="company">
      <label for="company-wallet">Business</label>
      <hr />
      
      <input type="text" name="title" class="swal2-input" placeholder="Wallet name">
      <label class="form-error" data-error="meta.title"></label>
      
            
      <textarea name="description" class="swal2-textarea" style="resize: none;" placeholder="Wallet description"></textarea>
      <label class="form-error" data-error="meta.description"></label>
      
      <p>Owner information</p>

      <input type="text" id="contact-phone-number" name="phone-number" class="swal2-input" placeholder="Phone number">
      <label class="form-error" data-error="contact.phoneNumber"></label>
      
      <input type="email" id="contact-email" class="swal2-input" name="email" placeholder="email">
      <label class="form-error" data-error="contact.email"></label>
      
      
      
      <div id="wallet-individual-data">
        <input type="text" name="firstname" class="swal2-input" placeholder="First name">
        <label class="form-error" data-error="contact.firstname"></label>
      
        <input type="text" name="surname" class="swal2-input" placeholder="Surname">
        <label class="form-error" data-error="contact.surname"></label>

        <input type="date" name="birthday" id="user-birthday" class="swal2-input" placeholder="Birthday&nbsp;">
        <label class="form-error" data-error="contact.birthday"></label>
      </div>
      
      <div id="wallet-company-data">
        <input type="text" name="companyName" class="swal2-input" placeholder="Company name">
        <label class="form-error" data-error="contact.companyName"></label>
      </div>
      
      <input type="text" name="w-address" class="swal2-input" placeholder="Address">
      <label class="form-error" data-error="contact.address"></label>
      
      <input type="text" name="w-city" class="swal2-input" placeholder="City">
      <label class="form-error" data-error="contact.city"></label>
      
      <select name="w-country" class="swal2-input">
          <option value="" disabled selected>Country</option>
          <option value="IT">Italy</option>
          <option value="DE">Germany</option>
          <option value="ES">Spain</option>
          <option value="FR">France</option>
          <option value="LU">Luxemburg</option>
          <option value="PT">Portugal</option>
          <option value="IE">Ireland</option>
      </select>
      <label class="form-error" data-error="contact.country"></label>
      
      
      
      </form>
    `,
        confirmButtonText: 'Save Wallet',
        focusConfirm: false,
        didRender: () => {

            iti = intlTelInput(Swal.getPopup().querySelector("#contact-phone-number"), {
                onlyCountries: [ 'DE', 'ES', 'IT', 'FR', 'IE', 'PT', 'LU' ],
                separateDialCode: true
            });

            const individualDataBlock = Swal.getPopup().querySelector('#wallet-individual-data');
            const companyDataBlock = Swal.getPopup().querySelector('#wallet-company-data');

            companyDataBlock.style.display = 'none';

            const radios = Swal.getPopup().querySelectorAll('input[type=radio][name="type"]');


            Array.prototype.forEach.call(radios, function(radio) {
                radio.addEventListener('change', function (event) {
                    if(this.value === 'person') {
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

            const formData = new FormData(Swal.getPopup().querySelector('#new-wallet-form'));

            const payload = {
                type: formData.get('type'),
                contact: {
                    firstname: formData.get('firstname') ? formData.get('firstname') : null,
                    surname: formData.get('surname') ? formData.get('surname') : null,
                    companyName: formData.get('companyName') ? formData.get('companyName') : null,
                    email: formData.get('email'),
                    phoneNumber: Swal.getPopup().querySelector(".iti__selected-dial-code").innerText + String(formData.get('phone-number')),
                    country: formData.get('w-country'),
                    address: formData.get('w-address'),
                    city: formData.get('w-city'),
                    birthday: formData.get('birthday')
                },
                meta: {
                    title: formData.get('title'),
                    description: formData.get('description')
                }
            };

            Swal.getPopup()
                .querySelectorAll("[data-error]")
                .forEach(errEl => errEl.innerText = "")

            let response;

            try {
                response = await apiClient.Wallets.create(payload).execute();

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
