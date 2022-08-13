const orderController = require('../Controller/orderController')
const router = require('express').Router();

router.get('/checkout-session/:id', orderController.getCheckoutSession)


module.exports = router