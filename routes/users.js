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

// ////////////product management ////////////////////////
router.route('/:userid/products/:id').get(async(req,res)=>{
  try {
    console.log(req.params.userid)
    const user =await Usersmodel.findById(req.params.userid);
    const product = await Product.findById(req.params.id);
    res.render('productdetail',{product,user});
    
  } catch (error) {
    
  }
})

//////////////////////////////////////////////////////////


/////////////// category management ///////////////////////

router.route('/:userid/categorys/:id').get(async(req,res)=>{
  try {
    const user =await Usersmodel.findById(req.params.userid);
    const cateproducts= await Product.find().populate('subCategory')
    const products= await cateproducts.filter(e=>{
      if(e.subCategory.categoryName==req.params.id){
        return true

      }else{
        return false
      }
      
    });
    console.log(products);
    res.render('store',{products,user})
  } catch (error) {
    
  }
})


///////////////////////////////////////////////////////////


/////////////// cart management ///////////////////////////
router
  .route("/:id/carts")
  .get(async(req, res) => {
   try {
    const user=await Usersmodel.findById(req.params.id).populate('cart')
     res.render('cart',{user});
    
   } catch (error) {
    console.log(error);
   } 
    
  })
  .post(async(req,res)=>{
    try {
      const user= await Usersmodel.findByIdAndUpdate(req.params.id);
      console.log(String(req.body.value));
      console.log(user.cart);
      res.json({user}) 
    } catch (error) {
      console.log(error)
    }
  }).patch(async(req,res)=>{
    try {
      const user= await Usersmodel.findByIdAndUpdate(req.params.id,{$p:{cart:req.body.value}});
      res.json({user});
    } catch (error) {
      console.log(error);
    }
  })

  ////////////////////////////////////////////////////////////

module.exports = router;
