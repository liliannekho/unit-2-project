const cartSchema = new mongoose.Schema({
    owner: {type: isObjectIdOrHexString, required: true, ref: 'User'},
    items: [{itemId: {type: ObjectId, ref: 'Item', required: true}, name: String, quanitity: {
        type: Number, required: true, min: 1, default: 1} price: Number}], bill: {type: Number, required: true, default: 0}
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart 