import express from "express";
import bodyParser from "body-parser";
import { db } from "./database/index.js";
import { userRouter } from "./route/index.js";
import { authRouter } from "./route/index.js";
import { productRouter } from "./route/index.js";
import { orderRouter } from "./route/index.js";
import { adminRouter } from "./route/index.js";
import { cartRouter } from "./route/index.js";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/token-middleware.js";
import router from "./route/uploadRoutes.js";
import { createUploadsFolder } from "./security/helper.js";
import { createDefaultAdmin } from "./scripts/createAdmin.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Public routes (no authentication required)
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter); // Now handles auth per-route
app.use("/api/order", orderRouter); // Allow anonymous orders for checkout

// Protected routes (authentication required)
app.use("/api/cart", cartRouter); // Cart routes (already includes auth middleware)
app.use("/api/file", authenticateToken, router);
app.use("/api/admin", adminRouter); // Admin routes (already includes auth middleware)

createUploadsFolder();

// Initialize database and create admin user
const initializeApp = async () => {
  try {
    console.log('🔄 Initializing database...');
    await db();
    console.log('✅ Database connected successfully');
    
    // Create default admin user
    await createDefaultAdmin();
    
    // Start the server
    app.listen(port, function () {
      console.log("🚀 Project running on port", port);
    });
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
};

initializeApp();

