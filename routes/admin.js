const router = require("express").Router();
const verifytoken = require("./verifytoken");
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

router.get("/", (req, res) => {
  res.render("admin/adminHome");
});

///////////category management/////////////////

router
  .route("/categorys")

  .get(adminController.getcategory)
  .post(adminController.createCategory);
router
  .route("/categorys/:id")
  .get(async (req, res) => {
    console.log(req.params.id);
    const subCategory = await SubCategory.find({
      categoryName: req.params.id,
    });
    console.log(subCategory);
    res.json({
      subCategory,
    });
  })
  .delete(adminController.deleteCategory);

////////////////////////////////////////////////

/////////  sub category management //////////////

router
  .route("/subcategorys")
  .get(async (req, res) => {
    const category = await Category.find();
    res.render("admin/products/subcategory", {
      category,
    });
  })
  .post(adminController.createSubCategory);

router.route("/subcategorys/:id").delete(adminController.deletesubCategory);

//////////////////////////////////////////////////

/////////////product management////////////////////

router.route("/products")
.get(adminController.getproductpage);

router.route("/products/:id")
.get(adminController.getAProduct)
.post(uploads,adminController.editProduct)
.delete(adminController.deleteProduct)

router.route("/addproducts")
.get(adminController.getAddProduct)
.post(uploads, adminController.addProduct);

////////////////////////////////////////////////////

//////////////user management//////////////////////
router.route("/users")
.get(verifytoken, adminController.getAllUsers)
// .post(verifytoken, adminController.createUser);

router.route("/addusers")
// .get(verifytoken, adminController.getCreateUser);

router.route("/users/:id")
.post(adminController.BlockUnbolck);
// .patch(adminController.getUpdateUser)

module.exports = router;
