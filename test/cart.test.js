const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const app = require('../app'); // Assuming your app is exported in app.js
const Cart = require('../models/cart');
const Item = require('../models/item');

const request = supertest(app);

describe('Cart API Tests', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the Cart and Item collections before each test
    await Cart.deleteMany({});
    await Item.deleteMany({});
  });

  it('should add an item to the cart', async () => {
    // Create a sample item to add to the cart
    const newItem = {
      name: 'Test Item',
      description: 'This is a test item.',
      category: 'Test Category',
      price: 19.99,
    };

    const createdItem = await Item.create(newItem);

    // Send a request to add the item to the cart
    const response = await request
      .post('/api/cart/add')
      .send({ itemId: createdItem._id, quantity: 2 });

    // Assertions
    response.status.should.equal(200);
    response.body.should.have.property('cart');
    response.body.cart.items.should.be.an('array').with.lengthOf(1);
    response.body.cart.items[0].itemId.should.equal(createdItem._id.toString());
    response.body.cart.items[0].quantity.should.equal(2);
    response.body.cart.bill.should.equal(2 * createdItem.price);
  });

  it('should get the user\'s cart', async () => {
    // Create a sample item
    const newItem = {
      name: 'Test Item',
      description: 'This is a test item.',
      category: 'Test Category',
      price: 19.99,
    };

    const createdItem = await Item.create(newItem);

    // Add the item to the cart
    await Cart.create({ userId: 'testUser', items: [{ itemId: createdItem._id, quantity: 2 }] });

    // Send a request to get the user's cart
    const response = await request.get('/api/cart');

    // Assertions
    response.status.should.equal(200);
    response.body.should.have.property('cart');
    response.body.cart.items.should.be.an('array').with.lengthOf(1);
    response.body.cart.items[0].itemId.should.equal(createdItem._id.toString());
    response.body.cart.items[0].quantity.should.equal(2);
    response.body.cart.bill.should.equal(2 * createdItem.price);
  });

  // Add more tests based on your application's cart functionality
});
