const express = require('express');
const Item = require('../models/item');
const itemsController = require('../controllers/itemsController');
const router = express.Router();
const {auth} = require('../controllers/userControllers')

router.use(auth)

// Create a new item
router.post('/create', itemsController.createItem) //postman test works

// Get all items
router.get('/', itemsController.getAllItems) //postman test works

// Get a single item by ID
router.get('/:id', itemsController.getItembyId) // postman test works

// Update an item by ID
router.put('/:id', itemsController.updateItem) //postman test works

// Delete an item by ID
router.delete('/:id', itemsController.deleteItem) // postman test works 

module.exports = router;
