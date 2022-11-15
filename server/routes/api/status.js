const express                  = require('express');
const statusCtrl               = require('../../controllers/status');

const router = express.Router();

router.get('/status', statusCtrl);

module.exports = router;