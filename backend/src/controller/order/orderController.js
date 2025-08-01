import { Order, OrderItem, Product, User } from '../../models/index.js';
import { sequelize } from '../../database/index.js';

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      customerInfo, 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      items, 
      subtotal, 
      tax, 
      shipping, 
      total 
    } = req.body;

    // Validate required fields
    if (!customerInfo || !shippingAddress || !billingAddress || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Get userId from the authenticated user (if logged in)
    const userId = req.user && req.user.user ? req.user.user.id : null;
    console.log('Order creation - User ID:', userId);
    console.log('Order creation - req.user:', req.user);
    console.log('Order creation - req.user.user:', req.user?.user);
    console.log('Order creation - Authorization header:', req.headers.authorization ? 'Present' : 'Missing');



    // Create order with new structure
    const order = await Order.create({
      userId: userId, // Will be null for guest orders, or user ID for logged-in users
      orderNumber,
      customerFirstName: customerInfo.firstName,
      customerLastName: customerInfo.lastName,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      // Shipping address
      shippingAddress: shippingAddress.address,
      shippingCity: shippingAddress.city,
      shippingState: shippingAddress.state,
      shippingZipCode: shippingAddress.zipCode,
      shippingCountry: shippingAddress.country,
      // Billing address
      billingAddress: billingAddress.address,
      billingCity: billingAddress.city,
      billingState: billingAddress.state,
      billingZipCode: billingAddress.zipCode,
      billingCountry: billingAddress.country,
      // Order totals
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      totalAmount: total,
      paymentMethod: paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction });

    // Create order items
    for (const item of items) {
      const productId = item.productId || item.Product?.id;
      console.log('Processing item:', { item, productId }); // Debug log
      
      const product = await Product.findByPk(productId);
      
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ 
          success: false,
          message: `Product ${productId} not found` 
        });
      }

      await OrderItem.create({
        orderId: order.id,
        productId: productId,
        quantity: item.quantity,
        price: item.Product?.price || product.price,
        size: item.size,
        color: item.color
      }, { transaction });

      // Optionally update stock if you have stock management
      // await product.update({ stock: product.stock - item.quantity }, { transaction });
    }

    await transaction.commit();

    // Fetch complete order with items and products
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: completeOrder,
        orderNumber: orderNumber
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }]
        }
      ]
    });

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.status(200).send({ data: order, message: "Order fetched successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({
      where: { orderNumber },
      include: [
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
      data: order, 
      message: "Order fetched successfully" 
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order' 
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    await order.update({ status });
    res.status(200).send({ data: order, message: "Order status updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }]
        }
      ],
      order: [['orderDate', 'DESC']]
    });

    res.status(200).json({ 
      success: true,
      data: orders, 
      message: "User orders fetched successfully" 
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user orders' 
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }]
        },
        { model: User }
      ],
      order: [['orderDate', 'DESC']]
    });

    res.status(200).send({ data: orders, message: "Orders fetched successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const orderController = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  getAllOrders
}; 