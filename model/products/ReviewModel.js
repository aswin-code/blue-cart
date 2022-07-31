const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usersmodel'
    },
    review: String
})