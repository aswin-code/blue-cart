
const stripe = require('stripe')('sk_test_51LVugISGF4nE7vqYEuRZ6XYr2tBxs2KM4EkgLh7PbjgzLKUDqdZYjyP4tx9yVGoNgM8ocnoNPdAMshsdnsxP2KGq00ElWpdCSm')
const OrderModel = require('../model/users/OrderModel');
const Usersmodel = require("../model/users/UserModel");
const Cart = require("../model/users/CartModel");
const mongoose = require('mongoose')

exports.getCheckoutSession = async (req, res, next) => {
    try {
        console.log(req.params.id)

        async function ordercall(next) {
            const order = await OrderModel.findOne({ _id: req.params.id })
            next(order)
        }
        async function next(order) {
            const url = `http://localhost:4000/users/${order.userid}`

            // 2) create  checkout session
            const session = await stripe.checkout.sessions.create({
                // Remove the payment_method_types parameter
                // to manage payment methods in the Dashboard
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {

                        currency: 'inr',
                        product_data: {
                            name: 'T-shirt',
                        },

                        unit_amount: (50 + order.totalBill * 1) * 100,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${url}?orderid=${order._id}&paid=true&userid=${order.userid}`,
                cancel_url: url,
            });


            res.json({ session })

        }
        ordercall(next)

        // const order = await OrderModel.findOne({ _id: req.params.id }, (err, order) => {

        //     console.log(err)
        //     console.log(order)

        // })




        // 3)Create session as response

    } catch (error) {

    }

}

exports.successfullPaymenet = async (req, res, next) => {
    try {

        const { orderid, paid, userid } = req.query;
        if (!orderid && !paid) return next();

        const order = await OrderModel.findByIdAndUpdate(orderid, { $set: { paid: true, status: "confirmed", paymentType: "Online payment" } })
        await Usersmodel.findByIdAndUpdate(order.userid, { $set: { cart: [] } })
        await Cart.findOneAndDelete({ userid: order.userid })

        res.redirect(`/users/${userid}`)
    } catch (err) {

    }

}