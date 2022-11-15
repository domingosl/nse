const express                  = require('express');
const usersCtrl                = require('../../controllers/users');

const router = express.Router();

router.get('/users/me', usersCtrl.get);
router.post('/users', usersCtrl.save);

module.exports = router;