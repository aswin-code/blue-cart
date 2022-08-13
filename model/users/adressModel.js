const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: [{
        address: String,
        state: String,
        city: String,
        pin: Number,
    }]

});
const addressModel = mongoose.model('address', addressSchema);

module.exports = addressModel;