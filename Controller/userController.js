const SubCategorymodel = require("../model/products/SubCategory");
const Product = require("../model/products/ProductModel");
const Category = require("../model/products/CategoryModel");
const Usersmodel = require("../model/UserModel");

exports.getUserPage=async (req, res, next) => {
  const subcategory = await SubCategorymodel.find().populate("categoryName");
  const category = await Category.find();
  const products = await Product.find();
  const user=await Usersmodel.findById(req.params.id);
  res.render("store", { products, category, subcategory,user });
}

// ////////////product management ////////////////////////

exports.getProducts=async(req,res)=>{
  try {
    console.log(req.params.userid)
    const user =await Usersmodel.findById(req.params.userid);
    const product = await Product.findById(req.params.id);
    res.render('productdetail',{product,user});
    
  } catch (error) {
    
  }
}
//////////////////////////////////////////////////////////

//////////////// category management ////////////////////

exports.getCategory=async(req,res)=>{
  try {
      const category = await Category.find();
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
    res.render('store',{products,user,category})
  } catch (error) {
    
  }
}

/////////////////////////////////////////////////////////


////////////////cart management ////////////////////////

exports.getCart=async(req, res) => {
   try {
    const user=await Usersmodel.findById(req.params.id).populate('cart')
     res.render('cart',{user});
    
   } catch (error) {
    console.log(error);
   } 
    
  }

exports.postCart=async(req,res)=>{
    try {
      const user= await Usersmodel.findOne({$and:[{_id:req.params.id},{cart:req.body.value}]});
      console.log(user)
      if(user){
        res.json({message:"item already in cart"})
      }else{
        const user= await Usersmodel.findByIdAndUpdate(req.params.id,{$push:{cart:req.body.value}});
        console.log(user.cart);
        res.json({user,message:"item added to cart"})
      }
    } catch (error) {
      console.log(error)
    }
  }

exports.patchCart=async(req,res)=>{
    try {
      const user= await Usersmodel.findByIdAndUpdate(req.params.id,{$pull:{cart:req.body.value}});
      res.json({user});
    } catch (error) {
      console.log(error);
    }
  }
///////////////////////////////////////////////////////