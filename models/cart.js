// models/cart.js

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
            name: String,
            quantity: { type: Number, required: true, min: 1, default: 1 },
            price: Number
        }
    ],
    bill: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

