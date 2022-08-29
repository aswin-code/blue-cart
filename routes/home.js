const express = require('express');
const authController = require('../Controller/authController')
const Product = require("../model/products/ProductModel");
const Category = require("../model/products/CategoryModel");
const router = express.Router();


/* GET home page. */
router.get('/', authController.checkLog, async (req, res, next) => {
  const products = await Product.find({}).populate('category').lean()
  const category = await Category.find({}).lean()
  res.render('home', { products, category });
});

module.exports = router;