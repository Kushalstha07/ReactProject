import { Order, OrderItem, Product, User } from '../../models/index.js';

const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;
    
    if (!userId || !items || !shippingAddress || !paymentMethod) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).send({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).send({ message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    // Create order items and update stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color
      });

      // Update stock
      await product.update({ stock: product.stock - item.quantity });
    }

    res.status(201).send({ data: order, message: "Order created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to create order' });
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

    res.status(200).send({ data: orders, message: "Orders fetched successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to fetch orders' });
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
        },
        { model: User }
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
  updateOrderStatus,
  getAllOrders
}; 