const Category = require("../model/products/CategoryModel");
const SubCategory = require("../model/products/SubCategory");
const Product = require("../model/products/ProductModel");
const User = require("../model/users/UserModel");
const ProductModel = require("../model/products/ProductModel");
const Usersmodel = require("../model/users/UserModel");
const OrderModel = require('../model/users/OrderModel');
const CouponModel = require('../model/products/couponModel');

// //////////  category management ///////////////

exports.getcategory = async (req, res) => {
  const category = await Category.find().lean()
  res.render("admin/category", { layout: 'adminlayout', category });
};

exports.createCategory = async (req, res) => {
  const newCategory = await new Category(req.body);
  newCategory.save();
  res.redirect("/admin/categorys");
};

exports.editCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { $set: req.body })
    res.json({ message: 'categor edited successfully' })
  } catch (err) {
    console.log(err)
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: {
        message: "delete",
      },
    });
  } catch (error) { }
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
  } catch (error) { }
};

// ////////////////////////////////////////////

// ///////////   product management ////////////

exports.getproductpage = async (req, res) => {
  const category = await Category.find().lean();
  const subCategory = await SubCategory.find().lean();
  const products = await Product.find().lean();
  const coupon = await CouponModel.find().lean();

  res.render("admin/products", {
    layout: "adminlayout",
    category,
    subCategory,
    products,
    coupon
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
  const { brandName, productName, price, discountPrice, stock, size, description, subCategory } = req.body

  const image = req.file.filename;

  const newProduct = await new Product({ brandName, productName, price, discountPrice, stock, size, description, subCategory, image, });

  newProduct.save();

  res.redirect("/admin/products");
};



exports.getAProduct = async (req, res) => {
  try {
    const category = await Category.find().lean();
    const product = await Product.findById(req.params.id);
    const subcategory = await SubCategory.findById(product.subCategory).populate("categoryName").lean();
    console.log(subcategory);
    res.render("admin/editproduct", {
      layout: 'adminlayout',
      product,
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const category = await Category.find().lean();
    const subcategory = await SubCategory.findOne({ name: req.body.SubCategory })
    console.log(subcategory);
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log(product);
    res.redirect('/admin/products')
  } catch (error) {
    console.log(error)
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    await Usersmodel.updateMany({}, { $pull: { cart: req.params.id } })
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "product deleted", url: '/admin/products' })

  } catch (error) {
    console.log(error)

  }
}

//  ///////////////////////////////////////////

// ///////////  user managemnet ///////////////

exports.getAllUsers = async (req, res) => {
  const users = await User.find({
    isAdmin: false,
  }).lean();
  res.render("admin/users", {
    layout: "adminlayout",
    users,
  });
};

exports.BlockUnbolck = async (req, res) => {
  try {

    const { isActive } = await User.findById(req.body.userid)
    if (isActive) {
      await User.findByIdAndUpdate(req.body.userid, { $set: { isActive: false } });
      res.json({ message: "User have been blocked" });
      return
    }
    await User.findByIdAndUpdate(req.body.userid, { $set: { isActive: true } })
    res.json({ message: "User have been unblocked" })
  } catch (error) {
    console.log(error);
  }
}

///////////////////////////////////////////////


//============ order management ==================//

exports.getAllorders = async (req, res) => {
  try {
    const orders = await OrderModel.find()

    res.render('admin/orders', { layout: "adminlayout", orders })

  } catch (error) {

  }
}

exports.getAOrder = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate({ path: 'order', populate: { path: 'product' } })
    console.log(order)
    res.render('admin/orderDetail', { layout: "adminlayout", order })
  } catch (error) {

  }
}

exports.UpdateStatus = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } })
    console.log(order)
    res.json({ message: "order updated successfully" })
  } catch (error) {
    console.log(error)

  }
}

////////////////////////////////////////////////


//////////////// coupon management ////////////

exports.createCoupon = async (req, res) => {
  try {
    const newCoupon = await new CouponModel(req.body)
    console.log(newCoupon);
    newCoupon.save()
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err)
  }
}

exports.deleteCoupon = async (req, res) => {
  try {
    console.log(req.body)
    await CouponModel.findByIdAndDelete(req.body.couponid).then(
      res.json({ message: 'Coupon deleted successfully' })
    )
  } catch (error) {
    console.log(error)
  }
}

////////////////////////////////////////////


exports.getdata = async (req, res) => {
  const orders = await OrderModel.find()
  const totalOrders = orders.length
  const sales = await orders.reduce((acc, crr) => {
    if (crr.paid) {

      acc++
    }
    return acc
  }, 0);



  console.log(sales)
}
