const { randomUUID: uuidv4 } = require('crypto');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

function sessionId(req) { return req.headers['x-session-id'] || req.ip || 'anon'; }

async function getOrCreateCart(sid) {
  let cart = await Cart.findOne({ sessionId: sid });
  if (!cart) cart = await Cart.create({ cartId: uuidv4(), sessionId: sid, items: [] });
  return cart;
}

function recalc(cart) {
  cart.totalQuantity = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  return cart;
}

async function getCart(sid) {
  const cart = await getOrCreateCart(sid);
  await cart.populate('items.product');
  return cart;
}

async function addItem(sid, { productId, variantId, quantity }) {
  const product = await Product.findOne({ productId, isActive: true });
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  const variant = (product.variants || []).find(v => v.variantId === variantId && v.available);
  if (!variant) throw Object.assign(new Error('Please choose an available size.'), { status: 400 });
  const cart = await getOrCreateCart(sid);
  const existing = cart.items.find(i => i.productId === productId && i.variantId === variantId);
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + quantity);
  } else {
    cart.items.push({ product: product._id, productId, variantId, size: variant.size, quantity, unitPrice: product.price });
  }
  recalc(cart);
  await cart.save();
  await cart.populate('items.product');
  return cart;
}

async function updateItem(sid, itemId, quantity) {
  const cart = await getOrCreateCart(sid);
  const item = cart.items.id(itemId);
  if (!item) throw Object.assign(new Error('Not found'), { status: 404 });
  item.quantity = quantity;
  recalc(cart);
  await cart.save();
  await cart.populate('items.product');
  return cart;
}

async function removeItem(sid, itemId) {
  const cart = await getOrCreateCart(sid);
  cart.items = cart.items.filter(i => String(i._id) !== String(itemId));
  recalc(cart);
  await cart.save();
  await cart.populate('items.product');
  return cart;
}

async function clearCart(sid) {
  const cart = await getOrCreateCart(sid);
  cart.items = [];
  recalc(cart);
  await cart.save();
  return cart;
}

async function addLook(sid, lookId) {
  const Look = require('../models/Look');
  const look = await Look.findOne({ lookId });
  if (!look) throw Object.assign(new Error('Look not found'), { status: 404 });
  for (const pid of look.products) {
    const product = await Product.findOne({ productId: pid, isActive: true });
    if (!product || !product.variants.length) continue;
    const v = product.variants.find(x => x.available) || product.variants[0];
    await addItem(sid, { productId: pid, variantId: v.variantId, quantity: 1 });
  }
  return getCart(sid);
}

module.exports = { sessionId, getCart, addItem, updateItem, removeItem, clearCart, addLook };