const express = require('express');
const router = express.Router();
const Look = require('../models/Look');

router.get('/', async (req, res, next) => {
  try {
    const looks = await Look.find().sort({ createdAt: 1 });
    res.json(looks);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const look = await Look.findById(req.params.id);
    if (!look) return res.status(404).json({ error: 'Not found' });
    res.json(look);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const look = await Look.create(req.body);
    res.status(201).json(look);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const look = await Look.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!look) return res.status(404).json({ error: 'Not found' });
    res.json(look);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const r = await Look.deleteOne({ _id: req.params.id });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;