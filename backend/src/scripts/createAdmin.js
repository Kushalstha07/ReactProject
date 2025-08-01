import { sequelize } from '../database/index.js';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Sync database with alter to handle schema changes
    console.log('🔄 Syncing database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { 
        email: 'admin@cottonco.com'
      } 
    });
    
    if (existingAdmin) {
      console.log('✅ Default admin user already exists');
      return;
    }
    
    // Create default admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@cottonco.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin'
    });
    
    console.log('✅ Default admin user created successfully:');
    console.log(`   Email: admin@cottonco.com`);
    console.log(`   Password: admin123`);
    console.log(`   Role: admin`);
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
    console.error('Error details:', error.message);
  }
};

export { createDefaultAdmin };
