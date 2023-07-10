const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  flowers: [
    {
      flower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'flower',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      name: String, 
      price: Number
    },
  ],  
  status: {
    type: String,
    enum: ['Pending', 'Complete', 'Cancelled'],
    default: 'Pending',
  },
});

module.exports = mongoose.model('Order', orderSchema);
