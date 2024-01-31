const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Item = require('../models/item');
const User = require('../models/user');

const server = app.listen(3001, () => console.log('Testing on PORT 3001'));
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  mongoServer.stop();
  server.close();
});

beforeEach(async () => {
  await Item.deleteMany({});
});

describe('Cart API Tests', () => {
  test('should add an item to the cart', async () => {
    // Create a user
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });
    await user.save();
    
    // Login the user to get the token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({ email: 'john.doe@example.com', password: 'password123' });

    const token = responseLogin.body.token;

    // Create an item with userId
    const newItem = {
      name: 'Test Item',
      description: 'This is a test item.',
      category: 'Test Category',
      price: '19.99',
    };

    const response = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send(newItem);

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.userId).toEqual(user._id.toString());
    expect(response.body.name).toEqual(newItem.name);
    expect(response.body.description).toEqual(newItem.description);
    expect(response.body.category).toEqual(newItem.category);
    expect(response.body.price).toEqual(newItem.price);
  });

})
