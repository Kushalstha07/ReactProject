import { Cart, Product, User } from '../models/index.js';

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware
    
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image', 'category']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      data: cartItems,
      message: 'Cart retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already exists in cart with same size/color
    const existingCartItem = await Cart.findOne({
      where: {
        userId,
        productId,
        size: size || null,
        color: color || null
      }
    });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += parseInt(quantity);
      await existingCartItem.save();
      
      const updatedItem = await Cart.findByPk(existingCartItem.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'image', 'category']
        }]
      });

      return res.status(200).json({
        data: updatedItem,
        message: 'Cart updated successfully'
      });
    } else {
      // Create new cart item
      const cartItem = await Cart.create({
        userId,
        productId,
        quantity: parseInt(quantity),
        size,
        color
      });

      const newCartItem = await Cart.findByPk(cartItem.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'image', 'category']
        }]
      });

      return res.status(201).json({
        data: newCartItem,
        message: 'Item added to cart successfully'
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const cartItem = await Cart.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    const updatedItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image', 'category']
      }]
    });

    res.status(200).json({
      data: updatedItem,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.status(200).json({
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({
      where: { userId }
    });

    res.status(200).json({
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

// Get cart count
const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Cart.sum('quantity', {
      where: { userId }
    }) || 0;

    res.status(200).json({
      data: { count },
      message: 'Cart count retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({ error: 'Failed to get cart count' });
  }
};

export const cartController = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};
