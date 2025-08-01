import express from "express";
import { orderController } from "../../controller/order/orderController.js";
import { authenticateToken } from "../../middleware/token-middleware.js";
import { optionalAuth } from "../../middleware/optional-auth-middleware.js";

const router = express.Router();

// Route for order creation (requires authentication)
router.post("/", authenticateToken, orderController.createOrder);

// Protected routes for logged-in users
router.get("/user/:userId", authenticateToken, orderController.getUserOrders);
router.get("/number/:orderNumber", orderController.getOrderByNumber);
router.get("/:id", orderController.getOrderById);
router.put("/:id/status", authenticateToken, orderController.updateOrderStatus);
router.get("/", authenticateToken, orderController.getAllOrders);

export { router as orderRouter }; 