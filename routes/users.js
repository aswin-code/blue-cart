var express = require("express");
var router = express.Router();
const path = require('path')
const verifytokenAndAuthorization = require("../routes/verifytoken");
const UserController = require('../Controller/userController');
const orderController = require('../Controller/orderController')

/* GET users listing. */
router.route("/:id")
  .get(verifytokenAndAuthorization, orderController.successfullPaymenet, UserController.getUserPage);

// ////////////product management ////////////////////////
router.route('/:userid/products/:id')
  .get(UserController.getProducts)
  .post(UserController.getoverview)

//////////////////////////////////////////////////////////



/////////////// cart management ///////////////////////////
router
  .route("/:id/carts")
  .get(UserController.getCart)
  .post(UserController.postCart)
  .patch(UserController.patchCart)


router.route('/:id/cartpage').get(UserController.getCartpage)
//////////////////////////////////////////////////////////////

router.route('/:id/test').get(UserController.getAllProducts)


// //////////////////  user profile ////////////////////////

router.route('/:id/profile')
  .get(UserController.getProfilePage)
  .patch(UserController.patchUserProfile)


////////////////////////////////////////////////////////////

// ///////////// address management /////////////////////////

router.route('/:id/address')
  .get(UserController.getAddress)
  .post(UserController.postAddress)
  .delete(UserController.deleteAddress)


router.route('/:id/address/:addid')
  .get(UserController.getAAddress)
  .post(UserController.editAddress)

////////////////////////////////////////////////////////////

module.exports = router;

//////////////// check out ///////////////////////////////

router.route('/:id/check-out')
  .get(verifytokenAndAuthorization, UserController.getCheckOutPage)
  .post(UserController.postCheckOut)
  .patch(UserController.cashOnDelivery)


//////////////////////////////////////////////////////////



//////////////////  order /////////////////////////////

router.route('/:id/orders')
  .get(UserController.getAllOrder)

router.route('/:id/orders/:orderid')
  .get(UserController.getAOrder)

////////////// coupon //////////////////////////////////

router.route('/coupon')
  .post(UserController.checkCoupon)


////////////////////////////////////////////////////////
