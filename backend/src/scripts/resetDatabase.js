import { sequelize } from '../database/index.js';
import dotenv from 'dotenv';

dotenv.config();

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');
    
    // Drop all tables and recreate them
    await sequelize.sync({ force: true });
    
    console.log('✅ Database reset successfully');
    console.log('📝 All tables have been dropped and recreated');
    console.log('⚠️  All data has been lost!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    console.error('Error details:', error.message);
  } finally {
    // Close the database connection
    await sequelize.close();
    process.exit(0);
  }
};

// Run the reset if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase();
}

export { resetDatabase }; 