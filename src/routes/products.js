const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res, next) => {
  try {
    const { q, vendor, featured, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (vendor) filter.vendor = vendor;
    if (featured === 'true') filter.isFeatured = true;
    if (q) filter.$text = { $search: q };
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: 1 }).skip((p - 1) * l).limit(l),
      Product.countDocuments(filter)
    ]);
    res.json({ items, total, page: p, limit: l, pages: Math.ceil(total / l) });
  } catch (err) { next(err); }
});

router.get('/featured', async (req, res, next) => {
  try {
    const items = await Product.find({ isActive: true, isFeatured: true });
    res.json(items);
  } catch (err) { next(err); }
});

router.get('/slug/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOne({ productId: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) { next(err); }
});

router.get('/:id/variants', async (req, res, next) => {
  try {
    const product = await Product.findOne({ productId: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product.variants);
  } catch (err) { next(err); }
});

module.exports = router;