const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const app = require('../app'); // Assuming your app is exported in app.js
const Item = require('../models/item');

const request = supertest(app);

describe('Item Model Tests', () => {
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
    await Item.deleteMany({});
  });

  it('should create a new item', async () => {
    const newItem = {
      userId: mongoose.Types.ObjectId(),
      name: 'Test Item',
      description: 'This is a test item.',
      category: 'Test Category',
      price: '19.99',
    };

    const response = await request.post('/api/items').send(newItem);

    // Assertions using Mocha's built-in assertions
    response.status.should.equal(201);
    response.body.should.have.property('_id');
    response.body.userId.should.equal(newItem.userId.toString());
    response.body.name.should.equal(newItem.name);
    response.body.description.should.equal(newItem.description);
    response.body.category.should.equal(newItem.category);
    response.body.price.should.equal(newItem.price);

    // Check if the item is actually stored in the in-memory database
    const createdItem = await Item.findOne({ _id: response.body._id });
    should.exist(createdItem);
    createdItem.userId.toString().should.equal(newItem.userId.toString());
    createdItem.name.should.equal(newItem.name);
    createdItem.description.should.equal(newItem.description);
    createdItem.category.should.equal(newItem.category);
    createdItem.price.should.equal(newItem.price);
  });

  it('should not create an item with missing required fields', async () => {
    const incompleteItem = {
      name: 'Incomplete Item',
      category: 'Incomplete Category',
      price: '29.99',
    };

    const response = await request.post('/api/items').send(incompleteItem);

    // Assertions using Mocha's built-in assertions
    response.status.should.equal(400);
    response.body.should.have.property('error');
    response.body.error.should.equal('ValidationError');
    response.body.message.should.be.an('array');
    response.body.message[0].msg.should.equal('Path `description` is required.');
  });

  // Add more tests based on your model and application requirements
});
