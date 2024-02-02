const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Item = require('../models/item');
const User = require('../models/user');
const Cart = require('../models/cart')

const server = app.listen(3001, () => console.log('Testing on PORT 3001'));
let mongoServer;
let user;
let token;
let testItem;
let createdCart
let createdItem

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

  // Define testItem here
  testItem = new Item({
    name: 'Test Item',
    price: 20,
    category: 'Test Category',
    description: 'Test Description',
    userId: user._id,
  });   await testItem.save();
});

afterAll(async () => {
  await mongoose.connection.close();
  mongoServer.stop();
  server.close();
});

beforeEach(async () => {
  await Item.deleteMany({});
});

//Create test pass
describe('Cart Model Tests', () => {
  test('should create and save a cart model', async () => {
    const newCart = {
      userId: User._id,
      items: [
        {
          itemId: testItem._id,
          quantity: 2
        }
      ],
      bill: 40,
    };

    const response = await request(app)
      .post('/carts')
      .set('Authorization', `Bearer ${token}`)
      .send(newCart);

      
    //save created cart for later
    createdCart = response.body

    expect(response.statusCode).toBe(201);
    expect(createdCart).toBeDefined();
    expect(response.body.userId).toEqual(user._id.toString());
    expect(response.body.items).toHaveLength(1);
    expect(response.body.bill).toEqual(40);

  });
});

// //get test
test('should get user cart', async () => {
  // const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });
  // await user.save();
  // const token = await user.generateAuthToken();

  const createdItem = await Item.create({
    name: 'apple',
    description: 'fruit',
    category: 'fruits & veg',
    price: 1.99,
    userId: user._id,
  });

  const createdCart = await Cart.create({
    userId: user._id, 
    items: [
      {
        itemId: createdItem._id, 
        quantity: 2
      },
    ],
    bill: 3.98
  });

  const response = await request(app).get(`/carts/${user._id}`)
    .set('Authorization', `Bearer ${token}`)

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('_id');
  expect(response.body.items).toHaveLength(1);
});

test('should update cart', async () => {
  // const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });
  // await user.save();
  // const token = await user.generateAuthToken();

  // const foundItem = await Item.create({
  //   name: 'Pear',
  //   description: 'Fruit',
  //   category: 'Fruits & Veg',
  //   price: 1.99,
  //   userId: user._id,
  // });

//   const foundCart = await Cart.create({
//     userId: user._id, 
//     items: [
//       {
//         itemId: foundItem._id, 
//         quantity: 2
//       },
//     ],
//     bill: 3.98, 
//   });

//   const response = await request(app)
//   .put(`/carts/${user._id}`)
//   .set('Authorization', `Bearer ${token}`)
//   .send({ items: [{ name: 'Pear' }] });

//   expect(response.statusCode).toBe(200);
//   expect(response.body.items[0].name).toEqual("Pear")
const user = new User({
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
});
await user.save();
const token = await user.generateAuthToken();

const foundItem = await Item.create({
  name: 'Pear',
  description: 'Fruit',
  category: 'Fruits & Veg',
  price: 1.99,
  userId: user._id,
});

const initialQuantity = 2;

const foundCart = await Cart.create({
  userId: user._id,
  items: [
    {
      itemId: foundItem._id,
      quantity: initialQuantity,
    },
  ],
  bill: 3.98,
});

const updatedQuantity = 5; // New quantity value

const response = await request(app)
  .put(`/carts/${user._id}`)
  .set('Authorization', `Bearer ${token}`)
  .send({ items: [{ itemId: foundItem._id, quantity: updatedQuantity }] });

expect(response.statusCode).toBe(200);
expect(response.body.items[0].quantity).toEqual(updatedQuantity);
});
// })

test('should delete the cart', async () => {
     const response = await request(app)
    .delete(`/carts/${user._id}`)
    .set('Authorization', `Bearer ${token}`);
  
expect(response.statusCode).toBe(204);

});
