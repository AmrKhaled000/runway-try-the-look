const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variantId: { type: Number, required: true },
  size: { type: String, required: true },
  available: { type: Boolean, default: true },
  sku: { type: String, default: '' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  vendor: { type: String, default: 'Nike', trim: true },
  type: { type: String, default: '', trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  sizes: { type: [String], default: [] },
  variants: { type: [variantSchema], default: [] },
  originalProductUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ isActive: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);