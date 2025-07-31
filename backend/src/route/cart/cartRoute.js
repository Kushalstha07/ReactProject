import express from "express";
import { cartController } from "../../controller/cart/cartController.js";
import { authenticateToken } from "../../middleware/token-middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

router.get("/", cartController.getCart);
router.get("/count", cartController.getCartCount);
router.post("/", cartController.addToCart);
router.put("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

export { router as cartRouter };
