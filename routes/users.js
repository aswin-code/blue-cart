var express = require("express");
var router = express.Router();
const verifytokenAndAuthorization = require("../routes/verifytoken");
const UserController=require('../Controller/userController');

/* GET users listing. */
router.route("/:id")
.get(verifytokenAndAuthorization,UserController.getUserPage);

// ////////////product management ////////////////////////
router.route('/:userid/products/:id')
.get(UserController.getProducts)

//////////////////////////////////////////////////////////


/////////////// category management ///////////////////////

router.route('/:userid/categorys/:id').get(UserController.getCategory)


///////////////////////////////////////////////////////////


/////////////// cart management ///////////////////////////
router
  .route("/:id/carts")
  .get(UserController.getCart)
  .post(UserController.postCart)
  .patch(UserController.patchCart)

  ////////////////////////////////////////////////////////////

module.exports = router;
