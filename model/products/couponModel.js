const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name: String,
    couponDiscount: Number
});

const couponModel = mongoose.model('coupon', couponSchema)

module.exports = couponModel