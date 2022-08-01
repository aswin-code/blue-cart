const mongoose = require("mongoose");
const { schema } = require("./CategoryModel");

const subCategorySchema= new mongoose.Schema({
    name:{
        type:String
    },
    categoryName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Categorymdoel"
    }

});

const subCategoryModel= mongoose.model("SubCategory",subCategorySchema);
module.exports=subCategoryModel