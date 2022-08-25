const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: Number,
        total: Number
    }],
    totalBill: Number,
    shippingAddress: {
        address: String,
        state: String,
        city: String,
        pin: Number,

    },
    status: {
        type: String,
        default: 'pending'
    },
    discount: Number,
    paymentType: String,
    paid: {
        type: Boolean,
        default: false

    },
}, { timestamps: true })

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel