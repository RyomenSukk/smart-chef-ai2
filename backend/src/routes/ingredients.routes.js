import { Router } from "express";
import {
  listIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient
} from "../controllers/ingredients.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js"; // import middleware

const router = Router();

router.get("/", listIngredients);
router.post("/", protect, adminOnly, createIngredient);
router.put("/:id", protect, adminOnly, updateIngredient);
router.delete("/:id", protect, adminOnly, deleteIngredient);

export default router;