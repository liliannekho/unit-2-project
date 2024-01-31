const express = require('express');
const cartController = require('../controllers/cartControllers');
const router = express.Router();

// Create a new cart
router.post('/carts', cartController.createCart);

// Get a user's cart
router.get('/carts/:userId', cartController.getCart);

// Update a user's cart
router.put('/carts/:userId', cartController.updateCart);

// Delete a user's cart
router.delete('/carts/:userId', cartController.deleteCart);

module.exports = router;
