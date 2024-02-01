const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Item = require('../models/item');
const User = require('../models/user');

const server = app.listen(3001, () => console.log('Testing on PORT 3001'));
let mongoServer;
let user;
let token;
let createdItem;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a user
  user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });
  await user.save();

  // Login the user to get the token
  const responseLogin = await request(app)
    .post('/users/login')
    .send({ email: 'john.doe@example.com', password: 'password123' });

  token = responseLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  mongoServer.stop();
  server.close();
});

beforeEach(async () => {
  await Item.deleteMany({});
});

describe('Item API Tests', () => {
  test('should add an item', async () => {
    const newItem = {
      name: 'Test Item',
      description: 'This is a test item.',
      category: 'Test Category',
      price: 19.99,
    };

    const response = await request(app)
      .post('/items/create')
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

    // Save the created item for later use
    createdItem = response.body;
  });

  test('should get a single item', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });
    await user.save();
    const token = await user.generateAuthToken();

    const createdItem = await Item.create ({
      name: "apple",
      description: "fruit",
      category: "fruits & veg",
      price: 1.99,
      userId: user._id
    })

    const response = await request(app).get(`/items/${createdItem._id}`)
    .set('Authorization', `Bearer ${token}`)

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toEqual(createdItem.name);
  });

  test('should update an item', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });
    await user.save();
    const token = await user.generateAuthToken();

    const foundItem = await Item.create ({
      name: "apple",
      description: "fruit",
      category: "fruits & veg",
      price: 1.99,
      userId: user._id
    })

    const response = await request(app)
      .put(`/items/${foundItem._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({name: "pear", decription: "oval fruit", category: "fruit", price: 3.99});

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("pear");
  });

  test('should delete an item', async () => {
    const response = await request(app)
      .delete(`/items/${createdItem._id}`)
      .set('Authorization', `Bearer ${token}`);

    // Assertions
    expect(response.statusCode).toBe(204);
  });
});
