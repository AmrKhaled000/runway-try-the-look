const mongoose = require('mongoose');

const bagItemSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  variantId: { type: Number, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1, min: 1, max: 20 }
}, { timestamps: true });

module.exports = mongoose.model('BagItem', bagItemSchema);