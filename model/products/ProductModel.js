const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
  },
  size: {
    type: Array,
    required: true,
  },
  image: {
    type: String,
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "ReviewModel",
  },
  description: {
    type: String,
    required: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
  },
});



const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
