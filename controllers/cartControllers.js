const Cart = require('../models/cart');

exports.createCart = async (req, res) => {
    try {
        const cart = new Cart({ ...req.body, userId: req.user._id });
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId }).populate('items.itemId');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
      const userId = req.params.userId;
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      // Update cart properties based on req.body
      Object.assign(cart, req.body);
  
      await cart.save();
  
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.deleteCart = async (req, res) => {
    try {
      const userId = req.params.userId;
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      await cart.remove();
  
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };