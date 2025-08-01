import { sequelize } from '../database/index.js';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const forceResetDatabase = async () => {
  try {
    console.log('🔄 Force resetting database...');
    console.log('⚠️  This will delete ALL data!');
    
    // Force sync database to recreate all tables and types
    await sequelize.sync({ force: true });
    console.log('✅ Database force reset successfully');
    
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
    console.error('❌ Error force resetting database:', error);
    console.error('Error details:', error.message);
  } finally {
    // Close the database connection
    await sequelize.close();
    process.exit(0);
  }
};

// Run the force reset if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  forceResetDatabase();
}

export { forceResetDatabase }; 