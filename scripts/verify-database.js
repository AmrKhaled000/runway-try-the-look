require('dotenv').config();
const { connectDB } = require('../src/config/db');
const Product = require('../src/models/Product');
const Look = require('../src/models/Look');

const expectedProducts = [
  { id:'tatum-5-orbit-copy', price:149, variants:[57015167025457,57015167058225,57015167090993,57015167123761,57015167156529,57015167189297,57015167222065] },
  { id:'tshirt', price:199, variants:[56835911582001,56835911614769,56835911647537,56835911680305] },
  { id:'sweatshirt', price:199, variants:[56835806396721,56835806429489,56835806462257,56835806495025] },
  { id:'tatum-5-orbit', price:149, variants:[57015166730545,57015166763313,57015166796081,57015166828849,57015166861617,57015166894385,57015166927153] },
  { id:'hoodie-black', price:199, variants:[56836251681073,56836251713841,56836251746609,56836251779377] },
  { id:'sweatshirt-plus', price:199, variants:[56836143743281,56836143776049,56836143808817,56836143841585] },
  { id:'hoodie', price:199, variants:[56836002185521,56836002218289,56836002251057,56836002283825] },
  { id:'air-jordan-12-retro-copy', price:149, variants:[57015176364337,57015176397105,57015176429873,57015176462641,57015176495409,57015176528177,57015176560945] }
];

async function main() {
  await connectDB();
  console.log('RUNWAY DATABASE VERIFICATION\n');
  console.log('MongoDB Connection: SUCCESS\n');

  const products = await Product.find();
  const looks = await Look.find();

  let pass = true;
  // products count
  console.log('Products:');
  console.log(`Expected: 8`);
  console.log(`Found: ${products.length}`);
  const pc = products.length === 8 ? 'PASS' : 'FAIL';
  console.log(`Status: ${pc}\n`);
  if (products.length !== 8) pass = false;

  // expected ids
  const ids = products.map(p => p.productId);
  const missing = expectedProducts.filter(e => !ids.includes(e.id));
  console.log('Missing Products:');
  console.log(`Found: ${missing.length}`);
  console.log(`Status: ${missing.length === 0 ? 'PASS' : 'FAIL'}\n`);
  if (missing.length) pass = false;

  // duplicates
  const dup = ids.length !== new Set(ids).size;
  console.log('Duplicate Products:');
  console.log(`Found: ${dup ? 1 : 0}`);
  console.log(`Status: ${dup ? 'FAIL' : 'PASS'}\n`);
  if (dup) pass = false;

  // prices & variants
  let vOk = true;
  for (const e of expectedProducts) {
    const p = products.find(x => x.productId === e.id);
    if (!p || p.price !== e.price) { vOk = false; continue; }
    const vIds = (p.variants || []).map(v => v.variantId);
    for (const vid of e.variants) if (!vIds.includes(vid)) { vOk = false; }
  }
  console.log('Product Variants:');
  console.log(`Status: ${vOk ? 'PASS' : 'FAIL'}\n`);
  if (!vOk) pass = false;

  // images & urls
  const iOk = products.every(p => p.image && p.originalProductUrl);
  console.log('Product Images/URLs:');
  console.log(`Status: ${iOk ? 'PASS' : 'FAIL'}\n`);
  if (!iOk) pass = false;

  // looks
  console.log('Looks:');
  console.log(`Expected: 6`);
  console.log(`Found: ${looks.length}`);
  const lc = looks.length === 6 ? 'PASS' : 'FAIL';
  console.log(`Status: ${lc}\n`);
  if (looks.length !== 6) pass = false;

  // look refs
  const productSet = new Set(ids);
  let refs = 0, valid = 0;
  for (const l of looks) {
    refs += (l.products || []).length;
    for (const pid of (l.products || [])) if (productSet.has(pid)) valid++;
  }
  console.log('Look Product References:');
  console.log(`Expected: 18`);
  console.log(`Found: ${refs}`);
  console.log(`Valid: ${valid}`);
  console.log(`Status: ${refs === 18 && valid === 18 ? 'PASS' : 'FAIL'}\n`);
  if (refs !== 18 || valid !== 18) pass = false;

  // each look exactly 3
  const threeOk = looks.every(l => (l.products || []).length === 3);
  console.log('Each Look Has 3 Products:');
  console.log(`Status: ${threeOk ? 'PASS' : 'FAIL'}\n`);
  if (!threeOk) pass = false;

  // duplicate look ids
  const lookIds = looks.map(l => l.lookId);
  const lookDup = lookIds.length !== new Set(lookIds).size;
  console.log('Duplicate Looks:');
  console.log(`Found: ${lookDup ? 1 : 0}`);
  console.log(`Status: ${lookDup ? 'FAIL' : 'PASS'}\n`);
  if (lookDup) pass = false;

  // indexes
  const idx = await Product.collection.indexes();
  console.log('Product Indexes:', idx.map(i => Object.keys(i.key).join(',')).join(' | '));
  console.log('');

  console.log(`FINAL RESULT: ${pass ? 'ALL CHECKS PASSED' : 'FAILURES DETECTED'}`);
  process.exit(pass ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });