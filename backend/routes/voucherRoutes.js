//routes/voucherRoutes.js

const router = require('express').Router();
const c = require('../controllers/voucherController');

router.post('/', c.createVoucher);
router.get('/', c.getVouchers);
router.get('/:id', c.getVoucherById);
router.put('/:id', c.updateVoucher);

module.exports = router;