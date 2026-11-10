const express = require('express');
const router = express.Router();
const BagItem = require('../models/BagItem');
const Product = require('../models/Product');

function sessionId(req) {
  return req.headers['x-session-id'] || req.ip || 'anon';
}

router.get('/', async (req, res, next) => {
  try {
    const sid = sessionId(req);
    const items = await BagItem.find({ sessionId: sid });
    const enriched = await Promise.all(items.map(async (it) => {
      const product = await Product.findOne({ id: it.productId });
      return { id: it._id, variantId: it.variantId, productId: it.productId, quantity: it.quantity,
        product: product ? { name: product.name, price: product.price, image: product.image, url: product.url } : null };
    }));
    const total = enriched.reduce((s, e) => s + (e.product ? e.product.price * e.quantity : 0), 0);
    res.json({ items: enriched, total });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const sid = sessionId(req);
    const { productId, variantId, quantity = 1 } = req.body || {};
    if (!productId || !variantId) return res.status(400).json({ error: 'productId and variantId required' });
    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const variant = product.variants.find(v => v.id === variantId && v.a);
    if (!variant) return res.status(400).json({ error: 'Please choose an available size.' });
    const existing = await BagItem.findOne({ sessionId: sid, variantId });
    if (existing) {
      existing.quantity = Math.min(20, existing.quantity + quantity);
      await existing.save();
      return res.json(existing);
    }
    const item = await BagItem.create({ sessionId: sid, productId, variantId, quantity });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const sid = sessionId(req);
    const r = await BagItem.deleteOne({ _id: req.params.id, sessionId: sid });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/', async (req, res, next) => {
  try {
    const sid = sessionId(req);
    await BagItem.deleteMany({ sessionId: sid });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;