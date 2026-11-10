require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectDB } = require('./src/config/db');
const productRoutes = require('./src/routes/products');
const bagRoutes = require('./src/routes/bag');
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRoutes);
app.use('/api/bag', bagRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

async function start() {
  await connectDB();
  const { seedProducts } = require('./src/seed');
  await seedProducts();
  app.listen(PORT, () => console.log(`Runway server running on http://localhost:${PORT}`));
}

if (require.main === module) start();

module.exports = app;