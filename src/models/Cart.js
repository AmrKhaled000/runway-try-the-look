const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productId: { type: String, required: true },
  variantId: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, max: 20 },
  unitPrice: { type: Number, required: true, min: 0 }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  cartId: { type: String, required: true, unique: true },
  sessionId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items: { type: [cartItemSchema], default: [] },
  totalQuantity: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);