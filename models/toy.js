
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toySchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    body: {
        type: String,
        required: false
    }
}, {timestamps : true});

const Toy = mongoose.model('Toy', toySchema);

module.exports = Toy;