const mongoose = require('mongoose')

const flowerSchema = mongoose.Schema({
    f_id : Number,
    name : String,
    category: String,
    color:String,
    price:Number,
    stock:Number,
    description: String,
    image: String,
},{
    collection: "flowers"
})

module.exports = mongoose.model('flower', flowerSchema)