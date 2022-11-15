const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');

module.exports.show = async (_flow) => {



    blockingLoader.show();
    const response = await apiClient.Flows.read(_flow._id).execute();
    const flow = response.data;

    blockingLoader.hide();

    const { value: data } = await Swal.fire({
        confirmButtonText: 'Save Config',
        focusConfirm: false,
        title: 'Incoming Webhook configuration',
        html: `
<form id="config-incoming-webhook-form">
        <p>Point your event to this URL:</p>
        <p><a href="#" id="webhook-url"></a></p>

        <select name="method" class="swal2-input">
          <option value="" disabled selected>Accepted HTTP Method</option>
          <option value="POST">POST</option>
          <option value="GET">GET</option>
          <option value="*">*</option>
      </select>
      <label class="form-error" data-error="method"></label>
      
      <select name="content-type" class="swal2-input">
          <option value="" disabled selected>Content type</option>
          <option value="application/json">application/json</option>
      </select>
      <label class="form-error" data-error="contentType"></label>
     
      
      
      <input type="password" name="secret" class="swal2-input" placeholder="Secret">
      <label class="form-error" data-error="secret"></label>
</form>`,
        showCancelButton: true,
        didRender: () => {


            Swal.getPopup().querySelector('#webhook-url').innerHTML = flow.incomingUserWebhook.url;

            if(flow.incomingUserWebhook.method)
                Swal.getPopup().querySelector('select[name="method"]').value = flow.incomingUserWebhook.method;

            if(flow.incomingUserWebhook.contentType)
                Swal.getPopup().querySelector('select[name="content-type"]').value = flow.incomingUserWebhook.contentType;

            if(flow.incomingUserWebhook.secret)
                Swal.getPopup().querySelector('input[type=password][name="secret"]').value = flow.incomingUserWebhook.secret;


        },
        preConfirm: async () => {

            const formData = new FormData(Swal.getPopup().querySelector('#config-incoming-webhook-form'));

            try {

                const response = await apiClient.Flows.update(_flow._id, {
                    incomingUserWebhook: {
                        method: formData.get('method'),
                        contentType: formData.get('content-type'),
                        secret: formData.get('secret')
                    }
                }).execute();

                return response.data.incomingUserWebhook;

            }
            catch (error) {

                return false;

            }


        }
    });

    return data;

};
