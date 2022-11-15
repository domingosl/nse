const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');


module.exports.show = async (allowOutsideClick = true) => {

    return await Swal.fire({
        title: 'Login',
        allowOutsideClick,
        html: `<form id="login-form">

      <input type="email" id="contact-email" class="swal2-input" name="email" placeholder="email">
      <label class="form-error" data-error="email"></label>
      
      <input type="password" id="user-password" class="swal2-input" name="password" placeholder="password">
      <label class="form-error" data-error="password"></label>
      
      </form>
    `,
        confirmButtonText: 'Login',
        focusConfirm: false,
        preConfirm: async () => {


            blockingLoader.show();

            const formData = new FormData(Swal.getPopup().querySelector('#login-form'));

            const payload = {
                password: formData.get('password'),
                email: formData.get('email')
            };

            Swal.getPopup()
                .querySelectorAll("[data-error]")
                .forEach(errEl => errEl.innerText = "")

            let response;

            try {
                response = await apiClient.Auth.Login.create(payload).execute();

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
