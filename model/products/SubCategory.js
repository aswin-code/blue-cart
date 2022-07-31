const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Categorymodel = require("./CategoryModel");

const SubCategoryschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  categoryName: [
    {
      type: Schema.Types.ObjectId,
      ref: "Categorymdoel",
    },
  ],
});
const SubCategorymodel = mongoose.model("SubCategory", SubCategoryschema);

module.exports = SubCategorymodel;
