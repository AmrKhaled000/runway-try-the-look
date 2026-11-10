const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  product: { type: String, required: true },
  left: { type: Number, required: true },
  top: { type: Number, required: true }
}, { _id: false });

const lookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modelImage: { type: String, required: true },
  originalImage: { type: String, required: true },
  description: { type: String, default: '' },
  products: { type: [String], default: [] },
  pins: { type: [pinSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Look', lookSchema);