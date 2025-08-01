import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";

export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  // Customer Information
  customerFirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerLastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Shipping Address
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingZipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingCountry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Billing Address
  billingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billingCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingZipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingCountry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Order Details
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  shipping: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}); 