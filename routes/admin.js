const router = require("express").Router();
const verifytoken = require("./verifytoken");
const verifytokenAndAuthorization = require('../routes/verifytoken');
const Category = require("../model/products/CategoryModel");
const SubCategory = require("../model/products/SubCategory");
const adminController = require("../Controller/adminController");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: "public/images/items",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const uploads = multer({
  storage,
}).single("image");

router.get("/home", verifytokenAndAuthorization, adminController.getHome);

///////////category management/////////////////

router
  .route("/categorys")

  .get(verifytokenAndAuthorization, adminController.getcategory)
  .post(verifytokenAndAuthorization, adminController.createCategory);
router
  .route("/categorys/:id")
  .get(verifytokenAndAuthorization, async (req, res) => {

    const category = await Category.findById(req.params.id);
    res.json({
      category,
    });
  })

  .patch(verifytokenAndAuthorization, adminController.editCategory)
  .delete(verifytokenAndAuthorization, adminController.deleteCategory);

////////////////////////////////////////////////



/////////////product management////////////////////

router.route("/products")
  .get(verifytokenAndAuthorization, adminController.getproductpage)
  .post(verifytokenAndAuthorization, uploads, adminController.addProduct);

router.route("/products/:id")
  .get(verifytokenAndAuthorization, adminController.getAProduct)
  .post(verifytokenAndAuthorization, uploads, adminController.editProduct)
  .delete(verifytokenAndAuthorization, adminController.deleteProduct)


////////////////////////////////////////////////////

//////////////user management//////////////////////
router.route("/users")
  .get(verifytokenAndAuthorization, adminController.getAllUsers)
  .post(verifytokenAndAuthorization, adminController.BlockUnbolck)

/////////////// order management ///////////////

router.route('/orders')
  .get(adminController.getAllorders);

router.route('/orders/:id')
  .get(adminController.getAOrder)
  .patch(adminController.UpdateStatus)

////////////////////////////////////////////////

///////////// coupon ////////////////////////////
router.route('/coupons')
  .get(adminController.getAllCoupons)
  .post(adminController.createCoupon)


router.route('/coupons/:id')
  .get(adminController.getACoupon)
  .patch(adminController.editCoupon)
  .delete(adminController.deleteCoupon)

////////////////////////////////////////////////

router.route('/data').get(adminController.getdata)

module.exports = router;
