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


dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

// Public routes (no authentication required)
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter); // Now handles auth per-route

// Protected routes (authentication required)
app.use("/api/orders", authenticateToken, orderRouter);
app.use("/api/cart", cartRouter); // Cart routes (already includes auth middleware)
app.use("/api/file", authenticateToken, router);
app.use("/api/admin", adminRouter); // Admin routes (already includes auth middleware)

createUploadsFolder();
db();

// Create default admin user after database connection
setTimeout(async () => {
  await createDefaultAdmin();
}, 1000);

app.listen(port, function () {
  console.log("Project running on port", port);
});

