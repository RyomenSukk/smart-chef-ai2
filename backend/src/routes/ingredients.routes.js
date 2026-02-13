import { Router } from "express";
import {
  listIngredients,
  createIngredient
} from "../controllers/ingredients.controller.js";

const router = Router();

router.get("/", listIngredients);
router.post("/", createIngredient);

export default router;
