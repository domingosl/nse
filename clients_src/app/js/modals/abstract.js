const Swal = require('sweetalert2');
const Noty = require('noty');

class Modal {

    constructor() {

    }

    static Alert(type, message, title = 'NSE') {

        Swal.fire({
            icon: type,
            title: title,
            text: message
        })

    }

    static Toast(type, message, timeout = 1500) {


        new Noty({
            type: type,
            layout: 'bottomRight',
            text: message,
            timeout,
            theme: 'solarized'
        }).show();

    }

}

module.exports = Modal;