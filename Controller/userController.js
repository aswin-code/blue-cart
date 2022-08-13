const SubCategorymodel = require("../model/products/SubCategory");
const Product = require("../model/products/ProductModel");
const Category = require("../model/products/CategoryModel");
const Usersmodel = require("../model/users/UserModel");
const Cart = require("../model/users/CartModel");
const Order = require('../model/users/OrderModel');
const Coupon = require('../model/products/couponModel');

const addressModel = require('../model/users/adressModel');
const { set } = require("mongoose");
const ProductModel = require("../model/products/ProductModel");


const findtotal = (user) => {
  return total = user.cart.reduce(function (previousValue, currentValue) {
    return previousValue + currentValue.total;
  }, 0);
}

exports.getUserPage = async (req, res, next) => {
  const category = await Category.find()
  const products = await Product.find().populate({ path: 'subCategory', populate: { path: 'categoryName' } })
  const user = await Usersmodel.findById(req.params.id).populate({ path: 'cart', populate: { path: 'product' } })
  res.render("store", { products, user, category });
}

// ////////////product management ////////////////////////

exports.getAllProducts = async (req, res) => {
  const user = await Usersmodel.findById(req.params.userid);
  const product = await Product.find();
  res.render('productPage', { user, product })
}

exports.getProducts = async (req, res) => {
  try {
    console.log(req.params.userid)

    const user = await Usersmodel.findById(req.params.userid);
    const product = await Product.findById(req.params.id);
    res.json({ product, user });

  } catch (error) {

  }
}
//////////////////////////////////////////////////////////

////////////////cart management ////////////////////////

exports.getCart = async (req, res) => {
  try {
    const user = await Usersmodel.findById(req.params.id).populate({ path: 'cart', populate: { path: 'product' } })
    let total = findtotal(user)
    res.json({ user, total });

  } catch (error) {
    console.log(error);
  }

}

exports.getCartpage = async (req, res) => {
  try {
    const user = await Usersmodel.findById(req.params.id).populate({ path: 'cart', populate: { path: 'product' } })
    let total = findtotal(user)
    res.render('cart', { user, total });

  } catch (error) {
    console.log(error);
  }

}

exports.postCart = async (req, res) => {
  try {

    const product = await ProductModel.findById(req.body.productid)
    const total = product.discountPrice * req.body.qty
    const user = await Usersmodel.findById(req.params.id).populate('cart')
    const check = user.cart.find(e => e.product == req.body.productid)

    if (check) {
      const cart = await Cart.findByIdAndUpdate(check._id, { $inc: { qty: req.body.qty, total } })
      res.json({ user })
    } else {
      const cart = await new Cart({ userid: req.params.id, product: req.body.productid, total, qty: req.body.qty })
      cart.save();
      const user = await Usersmodel.findByIdAndUpdate(req.params.id, { $push: { cart: cart._id } }, { new: true });
      res.json({ user })
    }

  } catch (error) {
    console.log(error);
  }
}

exports.patchCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.body.cartid, { $inc: { qty: req.body.qty, total: req.body.price } }, { new: true }).populate('product').populate('userid')
    const user = await Usersmodel.findById(req.params.id).populate('cart')
    let total = findtotal(user);
    if (cart.qty <= 0) {
      const user = await Usersmodel.findByIdAndUpdate(req.params.id, { $pull: { cart: req.body.cartid } }, { new: true })
      const cart = await Cart.findByIdAndDelete(req.body.cartid, { new: true })
      res.json({ cart, total, user });
    } else {
      res.json({ cart, total, user })
    }

  } catch (error) {
    console.log(error);
  }
}
/////////////////////////////////////////////////////////

////////////////// user profile /////////////////////////

exports.getProfilePage = async (req, res) => {
  const user = await Usersmodel.findById(req.params.id).lean()
  res.render('user/userProfile', { user })

}

exports.patchUserProfile = async (req, res) => {
  try {
    console.log(req.body)
    const newUser = await Usersmodel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    console.log(newUser)
    res.json({ message: "profile updated successfully" })
  } catch (error) {
    console.log(error)
  }
}

////////////////////////////////////////////////////////

///////////  address management ///////////////////////
exports.getAddress = async (req, res) => {
  const user = await Usersmodel.findById(req.params.id)

  const address = await addressModel.find({ userid: req.params.id }).populate('address')
  console.log(user)
  res.render('user/addresspage', { user, address })

}

exports.postAddress = async (req, res) => {
  const user = await addressModel.find({ userid: req.params.id })
  console.log(user)
  if (user.length === 0) {
    console.log(req.body)
    const newAddress = await new addressModel({ userid: req.params.id, address: req.body })
    await Usersmodel.findByIdAndUpdate(req.params.id, { $push: { address: newAddress._id } })
    newAddress.save()
    console.log(newAddress)
    res.status(200)
    // res.json({ message: "address added successfully " })
  } else {
    console.log(req.body)
    const newAddress = await addressModel.update({ userid: req.params.id }, { $push: { address: req.body } })
    console.log(newAddress)
    res.status(200)
    // res.json({ message: "address updated successfully" })
  }

}

exports.deleteAddress = async (req, res) => {
  try {
    console.log("request", req.body, req.params.id)
    const address = await addressModel.updateOne({ userid: req.params.id }, { $pull: { address: { _id: req.body._id } } })
    console.log(address)
    res.json({ message: "failed" })
  } catch (err) {
    console.log(err)
  }
}

///////////////////////////////////////////////////////

// ////////////////// check out ////////////////////////////

exports.getCheckOutPage = async (req, res) => {
  try {
    const user = await Usersmodel.findById(req.params.id).populate({ path: 'cart', populate: { path: 'product' } }).populate({ path: 'address', populate: { path: 'address' } })
    let total = await findtotal(user);
    res.render('user/checkOutPage', { user, total })
  } catch (error) {

  }

}



exports.postCheckOut = async (req, res) => {
  try {
    const user = await Usersmodel.findById(req.params.id).populate({ path: 'cart', populate: { path: 'product' } }).populate({ path: 'address', populate: { path: 'address' } })
    const coupon = await Coupon.findOne({ name: req.body.code })


    let totalBill = 0
    const cart = user.cart.reduce((acc, curr) => {
      return acc.concat([
        {
          product: curr.product._id, qty: curr.qty, total: curr.total
        }
      ]);
    }, [])
    const total = cart.reduce((acc, curr) => {
      return acc + curr.total
    }, 0)
    if (coupon) {
      totalBill = (coupon.couponDiscount * -1) + total
    } else {
      totalBill = total;
    }


    const { address, state, city, pin } = user.address.address.find((e) => {
      if (e._id == req.body.addressid) {
        return true;
      }
    })


    const newOrder = await new Order({ userid: req.params.id, order: cart, shippingAddress: { address, state, city, pin }, totalBill, discount: total - totalBill })

    newOrder.save()
    res.json({ status: 201, url: `/order/checkout-session/${newOrder._id}` })


  } catch (error) {
    console.log(error)
  }
}



exports.cashOnDelivery = async (req, res) => {
  try {
    const user = await Usersmodel.findById(req.params.id).populate({ path: 'cart', populate: { path: 'product' } }).populate({ path: 'address', populate: { path: 'address' } })
    const coupon = await Coupon.findOne({ name: req.body.code })


    let totalBill = 0
    const carts = user.cart.reduce((acc, curr) => {
      return acc.concat([
        {
          product: curr.product._id, qty: curr.qty, total: curr.total
        }
      ]);
    }, [])
    const total = carts.reduce((acc, curr) => {
      return acc + curr.total
    }, 0)
    if (coupon) {
      totalBill = (coupon.couponDiscount * -1) + total
    } else {
      totalBill = total;
    }


    const { address, state, city, pin } = user.address.address.find((e) => {
      if (e._id == req.body.addressid) {
        return true;
      }
    })


    const newOrder = await new Order({ userid: req.params.id, order: carts, shippingAddress: { address, state, city, pin }, totalBill, discount: total - totalBill, paymentType: "cash On Delivery" })

    newOrder.save()

    await Usersmodel.findByIdAndUpdate(req.params.id, { $set: { cart: [] } })
    await Cart.findOneAndDelete({ userid: req.params.id })
    res.json({ url: `/users/${user._id}` })


  } catch (error) {
    console.log(error)
  }
}



//////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////// order //////////////////////////////////////


exports.getAllOrder = async (req, res) => {
  const user = await Usersmodel.findById(req.params.id)
  const orders = await Order.find({ userid: req.params.id }).populate({ path: 'order', populate: { path: 'product' } })
  res.render('user/order', { orders, user })

}

exports.getAOrder = async (req, res) => {
  try {
    console.log(req.params.orderid)
    const order = await Order.findById(req.params.orderid).populate({ path: 'order', populate: { path: 'product' } })
    console.log(order)
    res.render('user/orderDetails', { order })
  } catch (error) {


  }
}

////////////////////////////////////////////////////////////////

//////////////////// coupon ///////////////////////////////////


exports.checkCoupon = async (req, res) => {
  const coupon = await Coupon.findOne({ name: req.body.code })
  if (coupon) {
    res.json({ coupon })
  } else {
    res.json({ failed: "Invalid Coupon Code" })
  }

}

////////////////////////////////////////////////////////////////