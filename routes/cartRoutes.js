const express = require('express');
const cartController = require('../controllers/cartControllers');
const router = express.Router();
const {auth} = require('../controllers/userControllers')

router.use(auth)

// Create a new cart
router.post('/', cartController.createCart) 

// Get a user's cart
router.get('/:userId', cartController.getCart) 

// Update a user's cart
router.put('/:userId', cartController.updateCart) //

// Delete a user's cart
router.delete('/:userId', cartController.deleteCart);

module.exports = router;
