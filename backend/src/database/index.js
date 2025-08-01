import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',// other example mysql,oracle,h2
  }
);

export const db = async () => {
  try {
    // Test the connection first
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
    
    // Don't sync here - let the createAdmin script handle it
    return true;
  } catch (e) {
    console.error("❌ Failed to connect to database:", e);
    throw e;
  }
}



