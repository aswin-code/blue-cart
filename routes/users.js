var express = require("express");
var router = express.Router();
const SubCategorymodel = require("../model/products/SubCategory");
const Product = require("../model/products/ProductModel");
const Category = require("../model/products/CategoryModel");
const verifytokenAndAuthorization = require("../routes/verifytoken");
const Usersmodel = require("../model/UserModel");

/* GET users listing. */
router.get("/:id", verifytokenAndAuthorization, async (req, res, next) => {
  const subcategory = await SubCategorymodel.find().populate("categoryName");
  const category = await Category.find();
  const products = await Product.find();
  const user=await Usersmodel.findById(req.params.id);
  res.render("store", { products, category, subcategory,user });
});

router
  .route("/:id/carts")
  .get((req, res) => {})
  .post(async(req,res)=>{
    try {
      const user= await Usersmodel.findById(req.params.id);
      console.log(String(req.body.value));
      user.cart.push(req.body.value);
      user.save();
      console.log(user.cart);
      res.json({user})
    } catch (error) {
      console.log(error)
    }
  });

module.exports = router;
