const express = require('express');
const cartController = require('../controllers/cartControllers');
const router = express.Router();
const {auth} = require('../controllers/userControllers')

router.use(auth)

// Create a new cart
router.post('/', cartController.createCart) //Postman test good

// Get a user's cart
router.get('/:userId', cartController.getCart) //postman test good

// Update a user's cart
router.put('/:userId', cartController.updateCart) //postman test good

// Delete a user's cart
router.delete('/:userId', cartController.deleteCart) //postman test good

module.exports = router;

