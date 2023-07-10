const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.placeOrder);
router.get('/', orderController.getOrders);
router.put('/:orderId/cancel', orderController.cancelOrder);
router.delete('/:orderId', orderController.removeOrder);

module.exports = router;
