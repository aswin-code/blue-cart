const orderController = require('../Controller/orderController')
const router = require('express').Router();

router.get('/checkout-session/', orderController.getCheckoutSession)


module.exports = router