const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const { addItemSchema, updateItemSchema } = require('../validators/cartValidator');
const cart = require('../services/cartService');

router.get('/', async (req, res, next) => {
  try {
    const sid = cart.sessionId(req);
    const c = await cart.getCart(sid);
    res.json(c);
  } catch (err) { next(err); }
});

router.post('/items', validate(addItemSchema), async (req, res, next) => {
  try {
    const sid = cart.sessionId(req);
    const c = await cart.addItem(sid, req.body);
    res.status(201).json(c);
  } catch (err) { next(err); }
});

router.patch('/items/:itemId', validate(updateItemSchema), async (req, res, next) => {
  try {
    const sid = cart.sessionId(req);
    const c = await cart.updateItem(sid, req.params.itemId, req.body.quantity);
    res.json(c);
  } catch (err) { next(err); }
});

router.delete('/items/:itemId', async (req, res, next) => {
  try {
    const sid = cart.sessionId(req);
    const c = await cart.removeItem(sid, req.params.itemId);
    res.json(c);
  } catch (err) { next(err); }
});

router.delete('/', async (req, res, next) => {
  try {
    const sid = cart.sessionId(req);
    const c = await cart.clearCart(sid);
    res.json(c);
  } catch (err) { next(err); }
});

router.post('/add-look', async (req, res, next) => {
  try {
    const sid = cart.sessionId(req);
    const c = await cart.addLook(sid, req.body.lookId);
    res.json(c);
  } catch (err) { next(err); }
});

module.exports = router;