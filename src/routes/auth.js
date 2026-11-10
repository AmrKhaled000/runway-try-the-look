const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) return res.status(400).json({ error: 'username, email, password required' });
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.get('/me', async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) { next(err); }
});

module.exports = router;