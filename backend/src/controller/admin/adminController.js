import { User, Product, Order } from '../../models/index.js';
import { requireAdmin } from '../../middleware/admin-middleware.js';
import { sequelize } from '../../database/index.js';
import { Op } from 'sequelize';

/**
 * Admin Dashboard - Get overview statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount') || 0;
    
    // Recent orders (last 10)
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    
    // Monthly revenue for chart
    const monthlyRevenue = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });
    
    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue
        },
        recentOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

/**
 * Admin Users Management - Get all users with pagination
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    
    const whereClause = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalUsers: count,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * Admin Users Management - Update user role
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      message: "User role updated successfully",
      data: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

/**
 * Admin Users Management - Delete user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }
    
    await user.destroy();
    
    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * Admin Products Management - Get all products with pagination
 */
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    
    let whereClause = {};
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }
    if (category) {
      whereClause.category = category;
    }
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      message: "Products fetched successfully",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalProducts: count,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

/**
 * Admin Products Management - Create product
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      size,
      color,
      isActive = true
    } = req.body;
    
    // Validation
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock: stock || 0,
      size,
      color,
      isActive
    });
    
    res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

/**
 * Admin Products Management - Update product
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    await product.update(updateData);
    
    res.status(200).json({
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

/**
 * Admin Products Management - Delete product
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    await product.destroy();
    
    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

/**
 * Admin Orders Management - Get all orders with pagination
 */
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    
    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['name', 'email'] }
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalOrders: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch orders',
      message: error.message 
    });
  }
};

/**
 * Admin Orders Management - Get single order by ID
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id, {
      include: [
        { model: User, attributes: ['name', 'email'] },
        {
          model: OrderItem,
          include: [{ model: Product }]
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order',
      message: error.message 
    });
  }
};

/**
 * Admin Orders Management - Update order status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status" 
      });
    }
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    order.status = status;
    await order.save();
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update order status',
      message: error.message 
    });
  }
};

export const adminController = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};
