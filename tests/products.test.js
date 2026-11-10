const request = require('supertest');
const app = require('../server');

// In-memory product store for tests (no Mongo binary required)
const products = [
  { id: 'tatum-5-orbit-copy', name: 'Air Jordan 12 Retro', type: 'From the original lookbook', price: 149, image: 'x', sizes: ['40'], variants: [{ id: 1, a: true, o: ['40'] }], url: 'https://example.com/p' },
  { id: 'tshirt', name: 'Tshirt', type: 'From the original lookbook', price: 199, image: 'x', sizes: ['S'], variants: [{ id: 2, a: true, o: ['S'] }], url: 'https://example.com/t' }
];

jest.mock('../src/models/Product', () => {
  const store = products.slice();
  return {
    find: jest.fn(() => ({ sort: jest.fn(async () => store) })),
    findOne: jest.fn(async ({ id }) => store.find(p => p.id === id) || null),
    countDocuments: jest.fn(async () => store.length),
    insertMany: jest.fn(async (docs) => docs),
    create: jest.fn(async (d) => d)
  };
});

// prevent server from trying to connect to Mongo / seed
jest.mock('../src/config/db', () => ({ connectDB: jest.fn(async () => ({})), disconnectDB: jest.fn(async () => ({})) }));
jest.mock('../src/seed', () => ({ seedProducts: jest.fn(async () => {}) }));

describe('Products API', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('GET /api/products returns list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('GET /api/products/:id returns one product', async () => {
    const res = await request(app).get('/api/products/tshirt');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Tshirt');
    expect(res.body.price).toBe(199);
  });

  it('GET /api/products/:id 404 for unknown', async () => {
    const res = await request(app).get('/api/products/nope');
    expect(res.status).toBe(404);
  });
});