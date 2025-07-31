import express from "express";
import { adminController } from "../../controller/admin/adminController.js";
import { authenticateToken } from "../../middleware/token-middleware.js";
import { requireAdmin } from "../../middleware/admin-middleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard routes
router.get("/dashboard/stats", adminController.getDashboardStats);

// Users management routes
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Products management routes
router.get("/products", adminController.getAllProducts);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

// Orders management routes
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

export { router as adminRouter };
