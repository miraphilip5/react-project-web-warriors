const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  u_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  flower: [
    {
      f_id: { type: Number, required: true },
    },
    {
      quantity: { type: Number, required: true },
    },
  ],
},
{
  timestamps: true,
});

module.exports = mongoose.model("cart", cartSchema);
