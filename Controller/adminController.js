const Category = require("../model/products/CategoryModel");
const SubCategory = require("../model/products/SubCategory");
const Product = require("../model/products/ProductModel");
const User = require("../model/users/UserModel");
const ProductModel = require("../model/products/ProductModel");
const Usersmodel = require("../model/users/UserModel");
const OrderModel = require('../model/users/OrderModel');
const CouponModel = require('../model/products/couponModel');





// ============== HOME ============== ///

exports.getHome = async (req, res) => {
  const totalUser = (await User.find({})).length
  const totalOrders = (await OrderModel.find({})).length
  const totalProducts = (await Product.find({})).length
  const orders = await OrderModel.find({})
  const totalSales = orders.reduce((acc, crr) => { return acc + crr.totalBill }, 0)
  const cod = ((await OrderModel.find()).filter(e => e.paymentType == "cash On Delivery")).length
  const onlinePayments = cod - totalOrders


  res.render("admin/adminHome", { layout: 'adminlayout', totalOrders, totalProducts, totalUser, cod, onlinePayments, totalSales });
}




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
  const { brandName, productName, price, discountPrice, stock, size, description, category } = req.body

  const image = req.file.filename;

  const newProduct = await new Product({ brandName, productName, price, discountPrice, stock, size, description, category, image, });

  newProduct.save();

  res.redirect("/admin/products");
};



exports.getAProduct = async (req, res) => {
  try {
    const category = await Category.find().lean();
    const product = await Product.findById(req.params.id);
    const subcategory = await SubCategory.findById(product.subCategory).populate("categoryName").lean();

    res.render("admin/editproduct", {
      layout: 'adminlayout',
      product,
      category,
    });
  } catch (error) {

  }
};

exports.editProduct = async (req, res) => {
  try {
    const category = await Category.find().lean();
    const subcategory = await SubCategory.findOne({ name: req.body.SubCategory })

    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.redirect('/admin/products')
  } catch (error) {

  }
}

exports.deleteProduct = async (req, res) => {
  try {
    await Usersmodel.updateMany({}, { $pull: { cart: req.params.id } })
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "product deleted", url: '/admin/products' })

  } catch (error) {


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
    const total = order.order.reduce((acc, curr) => {
      return acc + curr.total
    }, 0)
    res.render('admin/orderDetail', { layout: "adminlayout", order, total })
  } catch (error) {

  }
}

exports.UpdateStatus = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } })

    res.json({ message: "order updated successfully" })
  } catch (error) {


  }
}

////////////////////////////////////////////////


//////////////// coupon management ////////////

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find().lean()
    res.render('admin/coupon', { layout: 'adminlayout', coupons })
  } catch (err) {

  }
}

exports.createCoupon = async (req, res) => {
  try {
    const newCoupon = await new CouponModel(req.body)

    newCoupon.save()
    res.redirect('/admin/coupons');
  } catch (err) {

  }
}
exports.getACoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id).lean()
    res.json({ coupon })
  } catch (err) {
    console.log(err)
  }
}

exports.editCoupon = async (req, res) => {
  try {
    await CouponModel.findByIdAndUpdate(req.params.id, { $set: req.body })
    res.json({ message: "data edited successfully" })
  } catch (err) {
    console.log(err)
  }
}

exports.deleteCoupon = async (req, res) => {
  try {

    await CouponModel.findByIdAndDelete(req.params.id).then(
      res.json({ message: 'Coupon deleted successfully' })
    )
  } catch (error) {

  }
}

////////////////////////////////////////////


exports.getdata = async (req, res) => {
  const orders = await OrderModel.find()
  const paid = orders.filter(e => e.paid)
  const onlinePayments = (orders.filter(e => e.paymentType == 'Online payment')).length
  const confirmedOrders = (orders.filter(e => e.status == 'confirmed')).length
  const outOfDelivery = (orders.filter(e => e.status == 'out of delivery')).length
  const delivered = (orders.filter(e => e.status == 'delivered')).length
  const canceledOrders = (orders.filter(e => e.status == 'cancel')).length
  const cod = orders.length - onlinePayments
  const paidOrders = paid.length;
  const unpaidOrders = orders.length - paidOrders
  console.log(onlinePayments)
  res.json({ orders, paidOrders, unpaidOrders, onlinePayments, cod, confirmedOrders, outOfDelivery, delivered, canceledOrders })
}
