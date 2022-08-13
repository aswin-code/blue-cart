const mongoose = require("mongoose");

const CartSchema= new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    qty:{
        type:Number,
        default:1
    },
    total:{
        type:Number
    }
});


const CartModel= mongoose.model("carts",CartSchema);

module.exports= CartModel;