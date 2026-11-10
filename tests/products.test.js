const request = require('supertest');
const app = require('../server');

const products = [
  { productId:'tatum-5-orbit-copy', name:'Air Jordan 12 Retro', slug:'air-jordan-12-retro-tatum-5-orbit-copy', price:149, isActive:true, isFeatured:true, image:'x', variants:[{variantId:1,size:'40',available:true}] },
  { productId:'tshirt', name:'Tshirt', slug:'tshirt-tshirt', price:199, isActive:true, isFeatured:true, image:'x', variants:[{variantId:2,size:'S',available:true}] }
];

jest.mock('../src/models/Product', () => ({
  find: jest.fn((filter) => {
    let res = products.filter(p => p.isActive);
    if (filter && filter.isActive === true) res = res.filter(p => p.isActive);
    if (filter && filter.isFeatured === true) res = res.filter(p => p.isFeatured);
    if (filter && filter.$text) { /* ignore */ }
    return { sort: jest.fn(() => ({ skip: jest.fn(() => ({ limit: jest.fn(async () => res) })) })), then: (cb) => Promise.resolve(res).then(cb) };
  }),
  findOne: jest.fn(async (q) => {
    if (q && q.productId) return products.find(p => p.productId === q.productId && p.isActive) || null;
    if (q && q.slug) return products.find(p => p.slug === q.slug && p.isActive) || null;
    return null;
  }),
  countDocuments: jest.fn(async () => products.length)
}));

jest.mock('../src/config/db', () => ({ connectDB: jest.fn(async () => ({})), disconnectDB: jest.fn(async () => ({})) }));
jest.mock('../src/seed', () => ({ seedProducts: jest.fn(async () => {}) }));
jest.mock('../src/seedLooks', () => ({ seedLooks: jest.fn(async () => {}) }));

describe('Products API', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  it('GET /api/products returns list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
  it('GET /api/products/:id 404 for unknown', async () => {
    const res = await request(app).get('/api/products/nope');
    expect(res.status).toBe(404);
  });
});