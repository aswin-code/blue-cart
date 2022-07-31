const mongoose = require("mongoose");
const subCategory = require("./SubCategory");

const Categoryschema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
});
const Categorymodel = mongoose.model("Categorymdoel", Categoryschema);
module.exports = Categorymodel;
