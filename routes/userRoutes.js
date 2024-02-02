const express = require('express')
const User = require('../models/user')
const userControllers = require('../controllers/userControllers')

const router = new express.Router();

router.post('/', userControllers.createUser); //Postman test came out good
router.post('/login', userControllers.loginUser); //postman test good
router.put('/:id', userControllers.updateUser); //postman test good
router.delete('/:id', userControllers.auth, userControllers.deleteUser); //postman test works 

module.exports = router;
