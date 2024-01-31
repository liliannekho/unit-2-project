const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const app = require('../app');
const Cart = require('../models/cart');
const Item = require('../models/item');

const request = supertest(app);

const server = app.listen(8080, () => console.log('Testing on PORT 8080'));


describe('Cart API Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Cart.deleteMany({});
    await Item.deleteMany({});
  });

  it('should add an item to the cart', async () => {
    const newItem = {
      name: 'Test Item',
      description: 'This is a test item.',
      category: 'Test Category',
      price: 19.99,
    };

    const createdItem = await Item.create(newItem);

    const response = await request
      .post('/api/cart/add')
      .send({ itemId: createdItem._id, quantity: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cart');
    expect(response.body.cart.items).toHaveLength(1);
    expect(response.body.cart.items[0].itemId).toEqual(createdItem._id.toString());
    expect(response.body.cart.items[0].quantity).toEqual(2);
    expect(response.body.cart.bill).toEqual(2 * createdItem.price);
  });

  it('should get the user\'s cart', async () => {
    const newItem = {
      name: 'Test Item',
      description: 'This is a test item.',
      category: 'Test Category',
      price: 19.99,
    };

    const createdItem = await Item.create(newItem);

    await Cart.create({ userId: 'testUser', items: [{ itemId: createdItem._id, quantity: 2 }] });

    const response = await request.get('/api/cart');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cart');
    expect(response.body.cart.items).toHaveLength(1);
    expect(response.body.cart.items[0].itemId).toEqual(createdItem._id.toString());
    expect(response.body.cart.items[0].quantity).toEqual(2);
    expect(response.body.cart.bill).toEqual(2 * createdItem.price);
  });
});
