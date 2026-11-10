const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

async function seedProducts() {
  const raw = fs.readFileSync(path.join(__dirname, 'data', 'catalog.json'), 'utf8').replace(/^\uFEFF/, '');
  const catalog = JSON.parse(raw);
  for (const it of catalog.items) {
    const variants = (it.variants || []).map(v => ({
      variantId: v.id,
      size: (v.o && v.o[0]) || '',
      available: v.a === true,
      sku: ''
    }));
    const doc = {
      productId: it.id,
      name: it.name,
      slug: slugify(it.name + '-' + it.id),
      vendor: (it.type === 'From the original lookbook') ? 'Nike' : (it.vendor || 'Nike'),
      type: it.type || '',
      description: '',
      price: it.price,
      currency: 'USD',
      image: it.image,
      images: [it.image],
      sizes: it.sizes || [],
      variants,
      originalProductUrl: it.url,
      isActive: true,
      isFeatured: true
    };
    await Product.updateOne({ productId: it.id }, { $set: doc }, { upsert: true });
  }
  console.log(`Seeded ${catalog.items.length} products (upsert)`);
}

module.exports = { seedProducts };