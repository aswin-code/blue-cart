const Category = require("../model/products/CategoryModel");
const SubCategory = require("../model/products/SubCategory");
const Product = require("../model/products/ProductModel");
const User = require("../model/UserModel");
const ProductModel = require("../model/products/ProductModel");

// //////////  category management ///////////////

exports.getcategory = (req, res) => {
  res.render("admin/products/category");
};

exports.createCategory = async (req, res) => {
  const newCategory = await new Category(req.body);
  newCategory.save();
  res.redirect("/admin/products");
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: {
        message: "delete",
      },
    });
  } catch (error) {}
};

exports.createSubCategory = async (req, res) => {
  const newSubcategory = await new SubCategory(req.body);
  newSubcategory.save().then(() => {
    res.redirect("/admin/products");
  });
};

exports.deletesubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: {
        message: "delete",
      },
    });
  } catch (error) {}
};

// ////////////////////////////////////////////

// ///////////   product management ////////////

exports.getproductpage = async (req, res) => {
  const category = await Category.find().lean();
  const subCategory = await SubCategory.find().lean();
  const products = await Product.find().lean();

  res.render("admin/products/viewProduct", {
    category,
    subCategory,
    products,
  });
};

exports.getAddProduct = async (req, res) => {
  const category = await Category.find().lean();
  const subCategory = await SubCategory.find().lean();
  res.render("admin/products/addproduct", {
    category,
    subCategory,
  });
};

exports.addProduct = async (req, res) => {
  console.log(req.file.filename);
  const brandName = req.body.brandName;
  const productName = req.body.productName;
  const price = req.body.price;
  const discountPrice = req.body.discountPrice;
  const stock = req.body.stock;
  const size = req.body.price;
  const description = req.body.description;
  const subCategory = req.body.subCategory;
  console.log(subCategory);
  const image = req.file.filename;

  const newProduct = await new Product({
    brandName,
    productName,
    price,
    discountPrice,
    stock,
    size,
    description,
    subCategory,
    image,
  });
  newProduct.save();
  res.redirect("/admin/products");
};

exports.getAProduct = async (req, res) => {
  try {
    const category = await Category.find().lean();
    const subCategory = await SubCategory.find().lean();
    const product = await Product.findById(req.params.id);
    const subcategory = await SubCategory.findById(product.subCategory).populate("categoryName").lean();
    res.render("admin/products/productDetails", {
      product,
      subcategory,
      category,
      subCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

//  ///////////////////////////////////////////

// ///////////  user managemnet ///////////////

exports.getAllUsers = async (req, res) => {
  const user = await User.find({
    isAdmin: false,
  }).lean();
  res.render("admin/users/viewUser", {
    user,
  });
};

exports.getCreateUser = (req, res) => {
  res.render("admin/users/addUser");
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    const result = newUser.save().then((e) => {
      res.json({
        status: "success",
        data: {
          newUser,
        },
      });
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

exports.getUpdateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    res.render("admin/users/updateUser", {
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id).then((e) => {
      res.json({
        status: "success",
      });
    });
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////
