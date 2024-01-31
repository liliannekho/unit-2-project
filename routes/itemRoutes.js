const express = require('express');
const Item = require('../models/item');
const itemsController = require('../controllers/itemsController');
const router = express.Router();

// Create a new item
router.post('/create', itemsController.createItem);

// Get all items
router.get('/items', itemsController.getAllItems);

// Get a single item by ID
router.get('/items/:id', itemsController.getItembyId);

// Update an item by ID
router.put('/items/:id', itemsController.updateItem);

// Delete an item by ID
router.delete('/items/:id', itemsController.deleteItem);

module.exports = router;
