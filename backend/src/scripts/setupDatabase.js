import { sequelize } from '../database/index.js';
import { User, Product, Order, OrderItem, Cart } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');
    
    // Force sync to recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully');
    
    // Create default admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@cottonco.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin user created:', adminUser.email);
    
    // Create sample products
    const sampleProducts = [
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        price: 29.99,
        category: 'women',
        image: 'tshirt.jpg',
        stock: 50,
        size: 'M',
        color: 'White'
      },
      {
        name: 'Denim Jeans',
        description: 'Classic denim jeans with perfect fit',
        price: 59.99,
        category: 'women',
        image: 'jeans.jpg',
        stock: 30,
        size: 'L',
        color: 'Blue'
      },
      {
        name: 'Kids Dress',
        description: 'Beautiful dress for kids',
        price: 39.99,
        category: 'kids',
        image: 'kids-dress.jpg',
        stock: 25,
        size: 'S',
        color: 'Pink'
      }
    ];
    
    for (const productData of sampleProducts) {
      await Product.create(productData);
    }
    console.log('✅ Sample products created');
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('Default Admin Credentials:');
    console.log('Email: admin@cottonco.com');
    console.log('Password: admin123');
    console.log('');
    console.log('Sample Products:');
    console.log('- Cotton T-Shirt ($29.99)');
    console.log('- Denim Jeans ($59.99)');
    console.log('- Kids Dress ($39.99)');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    console.error('Error details:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase }; 