import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas de productos requieren estar autenticado (Bearer token)
router.get("/", authMiddleware, productsController.getAllProducts);
router.get("/:id", authMiddleware, productsController.getProductById);
router.post("/create", authMiddleware, productsController.createProduct);
router.put("/:id", authMiddleware, productsController.updateProduct);
router.delete("/:id", authMiddleware, productsController.deleteProduct);

export default router;
