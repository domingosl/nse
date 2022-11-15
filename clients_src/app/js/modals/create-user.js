const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');



module.exports.show = async (allowOutsideClick = true) => {

    return await Swal.fire({
        title: 'User registration',
        allowOutsideClick,
        html: `<form id="new-user-form">
      
      <input type="text" class="swal2-input" name="invitation-code" placeholder="invitation code">
      
      <input type="email" id="contact-email" class="swal2-input" name="email" placeholder="email">
      <label class="form-error" data-error="email"></label>
      
      <input type="password" id="user-password" class="swal2-input" name="password" placeholder="password">
      <label class="form-error" data-error="password"></label>
      <input type="password" id="user-repeat-password" class="swal2-input" name="repeatPassword" placeholder="confirm password">
      <label class="form-error" data-error="repeatPassword"></label>


      
      </form>
    `,
        confirmButtonText: 'Signup',
        focusConfirm: false,
        didRender: () => {
        },
        preConfirm: async () => {


            blockingLoader.show();

            const formData = new FormData(Swal.getPopup().querySelector('#new-user-form'));

            const payload = {
                invitationCode: formData.get('invitation-code'),
                email: formData.get('email'),
                password: formData.get('password'),
                repeatPassword: formData.get('repeatPassword')
            };

            Swal.getPopup()
                .querySelectorAll("[data-error]")
                .forEach(errEl => errEl.innerText = "")

            let response;

            try {
                response = await apiClient.Users.create(payload).execute();

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
