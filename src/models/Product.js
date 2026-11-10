const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  a: { type: Boolean, default: true },
  o: { type: [String], default: [] }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  sizes: { type: [String], default: [] },
  variants: { type: [variantSchema], default: [] },
  url: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);