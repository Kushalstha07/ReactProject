import express from "express";
import { orderController } from "../../controller/order/orderController.js";
const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/user/:userId", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id/status", orderController.updateOrderStatus);
router.get("/", orderController.getAllOrders);

export { router as orderRouter }; 