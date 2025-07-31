export { User } from './user/User.js';
export { Product } from './Product.js';
export { Order } from './Order.js';
export { OrderItem } from './OrderItem.js';
export { Cart } from './cart/Cart.js';

// Import models for relationships
import { User } from './user/User.js';
import { Product } from './Product.js';
import { Order } from './Order.js';
import { OrderItem } from './OrderItem.js';
import { Cart } from './cart/Cart.js';

// Define relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Cart relationships
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });
