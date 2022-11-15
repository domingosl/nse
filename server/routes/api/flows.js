const express                  = require('express');
const flowsCtrl                = require('../../controllers/flows');

const router = express.Router();

router.get('/flows/:id', flowsCtrl.get);
router.post('/flows', flowsCtrl.save);
router.put('/flows/:id', flowsCtrl.update);
router.get('/flows', flowsCtrl.list);
router.delete('/flows/:id', flowsCtrl.delete);

module.exports = router;