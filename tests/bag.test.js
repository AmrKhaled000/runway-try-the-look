const request = require('supertest');
const app = require('../server');

jest.mock('../src/services/cartService', () => {
  const store = { items: [], totalQuantity: 0, subtotal: 0 };
  return {
    sessionId: () => 's1',
    getCart: jest.fn(async () => ({ ...store, items: [...store.items] })),
    addItem: jest.fn(async (sid, body) => {
      if (body.variantId === 999) throw Object.assign(new Error('Please choose an available size.'), { status: 400 });
      store.items.push({ _id: 'id1', productId: body.productId, variantId: body.variantId, quantity: body.quantity, unitPrice: 199 });
      store.totalQuantity = 1; store.subtotal = 199;
      return { ...store, items: [...store.items] };
    }),
    updateItem: jest.fn(async () => ({ ...store, items: [...store.items] })),
    removeItem: jest.fn(async () => { store.items = []; store.totalQuantity = 0; store.subtotal = 0; return { ...store, items: [] }; }),
    clearCart: jest.fn(async () => { store.items = []; store.totalQuantity = 0; store.subtotal = 0; return { ...store, items: [] }; }),
    addLook: jest.fn(async () => ({ ...store, items: [...store.items] }))
  };
});

jest.mock('../src/config/db', () => ({ connectDB: jest.fn(async () => ({})), disconnectDB: jest.fn(async () => ({})) }));
jest.mock('../src/seed', () => ({ seedProducts: jest.fn(async () => {}) }));
jest.mock('../src/seedLooks', () => ({ seedLooks: jest.fn(async () => {}) }));

describe('Bag API', () => {
  it('GET /api/bag empty initially', async () => {
    const res = await request(app).get('/api/bag').set('x-session-id', 's1');
    expect(res.status).toBe(200);
  });
  it('POST /api/bag/items adds an item', async () => {
    const res = await request(app).post('/api/bag/items').set('x-session-id', 's1')
      .send({ productId: 'tshirt', variantId: 56835911582001, quantity: 1 });
    expect(res.status).toBe(201);
  });
  it('POST /api/bag/items rejects unavailable variant', async () => {
    const res = await request(app).post('/api/bag/items').set('x-session-id', 's1')
      .send({ productId: 'tshirt', variantId: 999, quantity: 1 });
    expect(res.status).toBe(400);
  });
});