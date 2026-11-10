require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectDB } = require('./src/config/db');
const { applySecurity } = require('./src/middlewares/security');
const { errorHandler } = require('./src/middlewares/errorHandler');

const productRoutes = require('./src/routes/products');
const bagRoutes = require('./src/routes/bag');
const authRoutes = require('./src/routes/auth');
const lookRoutes = require('./src/routes/looks');

const app = express();
const PORT = process.env.PORT || 5000;

applySecurity(app);

app.get('/', async (req, res, next) => {
  try {
    const fs = require('fs');
    const { buildRunwayHtml } = require('./src/views');
    const tpl = fs.readFileSync(path.join(__dirname, 'views', 'index.html'), 'utf8');
    const inner = await buildRunwayHtml();
    res.type('html').send(tpl.replace('<!--RUNWAY_INNER-->', inner));
  } catch (err) { next(err); }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRoutes);
app.use('/api/bag', bagRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/looks', lookRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

async function start() {
  await connectDB();
  const { seedProducts } = require('./src/seed');
  await seedProducts();
  const { seedLooks } = require('./src/seedLooks');
  await seedLooks();
  app.listen(PORT, () => console.log(`Runway server running on http://localhost:${PORT}`));
}

if (require.main === module) start();
module.exports = app;