const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Import cart routes
const itemRoutes = require('./routes/itemRoutes'); // Import item routes

const app = express()

app.use(express.json())
app.use(morgan('combined'))

app.use('/users', userRoutes)
app.use('/carts', cartRoutes)
app.use('/items', itemRoutes)

module.exports = app;
