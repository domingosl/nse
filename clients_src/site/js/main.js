window.$ = window.jQuery = require('./jquery.min');
require('bootstrap');

const Modal = require('../../app/js/modals/abstract');

Modal.Alert(
    "info",
    "Hi! and thank you for coming!. NSE even tho fully functional, it is, for now, a fictional product created as a contender " +
    "for the first prize of the hackathon METABUILD III organized by NEAR PROTOCOL. " +
    "Any reference to NEAR or Pagoda intellectual material is used only as an example, and all user information collected during the life of this demo " +
    "will be wipe out after the hackathon is over. For now, please enjoy! (BTW you need an invitation code to access 😎, check the Devpost page or the Github repo)",

    "Disclaimer");