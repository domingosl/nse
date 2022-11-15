const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');

module.exports.show = async () => {


    const {value: flow } = await Swal.fire({
        title: 'New Flow',
        html: `<form id="new-flow-form">
      
      <p>Give your new Flow a nice name and description so can remember what it does</p>
      
      <input type="text" name="name" class="swal2-input" placeholder="Name">
      <label class="form-error" data-error="name"></label>
      
            
      <textarea name="description" class="swal2-textarea" style="resize: none;" placeholder="Description"></textarea>
      <label class="form-error" data-error="description"></label>
      
      </form>
    `,
        confirmButtonText: 'Save Flow',
        focusConfirm: false,
        preConfirm: async () => {

            blockingLoader.show();

            const formData = new FormData(Swal.getPopup().querySelector('#new-flow-form'));

            const payload = {
                name: formData.get('name'),
                description: formData.get('description')
            };

            Swal.getPopup()
                .querySelectorAll("[data-error]")
                .forEach(errEl => errEl.innerText = "")

            let response;

            try {

                response = await apiClient.Flows.create(payload).execute();

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

    return flow;

};
