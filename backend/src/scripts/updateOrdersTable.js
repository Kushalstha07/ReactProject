import { sequelize } from '../database/index.js';

const updateOrdersTable = async () => {
  try {
    console.log('Updating Orders table to allow null userId...');
    
    // Drop the constraint and recreate with allowing nulls
    await sequelize.query(`
      ALTER TABLE "Orders" 
      ALTER COLUMN "userId" DROP NOT NULL;
    `);
    
    console.log('Successfully updated Orders table - userId can now be null');
  } catch (error) {
    console.error('Error updating Orders table:', error);
  }
};

updateOrdersTable();
