const request = require('supertest');
const app = require('../server');

const products = [
  { id: 'tshirt', name: 'Tshirt', type: 'x', price: 199, image: 'x', sizes: ['S'], variants: [{ id: 56835911582001, a: true, o: ['S'] }], url: 'https://example.com/t' }
];

const bagStore = [];

jest.mock('../src/models/Product', () => ({
  findOne: jest.fn(async ({ id }) => products.find(p => p.id === id) || null),
  find: jest.fn(async () => products)
}));

jest.mock('../src/models/BagItem', () => {
  let counter = 0;
  const Model = function (doc) { Object.assign(this, doc); this._id = 'id' + (++counter); };
  Model.create = jest.fn(async (doc) => { const it = new Model(doc); bagStore.push(it); return it; });
  Model.find = jest.fn(async ({ sessionId }) => bagStore.filter(i => i.sessionId === sessionId));
  Model.findOne = jest.fn(async (q) => bagStore.find(i => i.sessionId === q.sessionId && i.variantId === q.variantId) || null);
  Model.deleteOne = jest.fn(async (q) => {
    const idx = bagStore.findIndex(i => i._id === q._id && i.sessionId === q.sessionId);
    if (idx >= 0) { bagStore.splice(idx, 1); return { deletedCount: 1 }; }
    return { deletedCount: 0 };
  });
  Model.deleteMany = jest.fn(async (q) => { for (let i = bagStore.length - 1; i >= 0; i--) if (bagStore[i].sessionId === q.sessionId) bagStore.splice(i, 1); });
  return Model;
});

jest.mock('../src/config/db', () => ({ connectDB: jest.fn(async () => ({})), disconnectDB: jest.fn(async () => ({})) }));
jest.mock('../src/seed', () => ({ seedProducts: jest.fn(async () => {}) }));

beforeEach(() => { bagStore.length = 0; });

describe('Bag API', () => {
  it('GET /api/bag empty initially', async () => {
    const res = await request(app).get('/api/bag').set('x-session-id', 's1');
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it('POST /api/bag adds an item', async () => {
    const res = await request(app).post('/api/bag').set('x-session-id', 's1')
      .send({ productId: 'tshirt', variantId: 56835911582001, quantity: 1 });
    expect(res.status).toBe(201);
    const list = await request(app).get('/api/bag').set('x-session-id', 's1');
    expect(list.body.items.length).toBe(1);
    expect(list.body.total).toBe(199);
  });

  it('POST /api/bag rejects unavailable variant', async () => {
    const res = await request(app).post('/api/bag').set('x-session-id', 's1')
      .send({ productId: 'tshirt', variantId: 999, quantity: 1 });
    expect(res.status).toBe(400);
  });

  it('DELETE /api/bag/:id removes item', async () => {
    const add = await request(app).post('/api/bag').set('x-session-id', 's1')
      .send({ productId: 'tshirt', variantId: 56835911582001, quantity: 1 });
    const id = add.body._id;
    const del = await request(app).delete('/api/bag/' + id).set('x-session-id', 's1');
    expect(del.status).toBe(200);
    const list = await request(app).get('/api/bag').set('x-session-id', 's1');
    expect(list.body.items.length).toBe(0);
  });
});