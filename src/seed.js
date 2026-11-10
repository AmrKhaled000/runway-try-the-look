const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  const raw = fs.readFileSync(path.join(__dirname, 'data', 'catalog.json'), 'utf8');
  const catalog = JSON.parse(raw);
  const docs = catalog.items.map((it) => ({
    id: it.id, name: it.name, type: it.type, price: it.price,
    image: it.image, sizes: it.sizes, variants: it.variants, url: it.url
  }));
  await Product.insertMany(docs);
  console.log(`Seeded ${docs.length} products`);
}

module.exports = { seedProducts };