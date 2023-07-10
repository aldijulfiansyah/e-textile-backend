import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageProduct,
  getImageById,
  getProductImageById,
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/products/image/:id", getProductImageById);
router.get("/image/:id", getImageById);
router.post("/products", createProduct);
router.post("/products/upload", uploadImageProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
