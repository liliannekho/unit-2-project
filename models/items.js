const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const itemSchema = mongoose.Schema({
    userId: {type: ObjectID, required: true, ref: 'User'},
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: String, required: true},
}, {
    timestamps: true
}
)

const Item = mongoose.model('Item', itemSchema)

module.exports = Item