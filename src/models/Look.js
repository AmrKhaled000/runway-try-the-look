const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  product: { type: String, required: true },
  left: { type: Number, required: true },
  top: { type: Number, required: true }
}, { _id: false });

const lookSchema = new mongoose.Schema({
  lookId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  modelImage: { type: String, required: true },
  products: { type: [String], default: [] },
  pins: { type: [pinSchema], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

lookSchema.index({ isActive: 1 });

module.exports = mongoose.model('Look', lookSchema);