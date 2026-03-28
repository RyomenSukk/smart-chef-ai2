import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.middleware.js";
import { recommendMenus, saveRecipe, getRecipeById } from "../controllers/recommend.controller.js";

// 👇 1. Import protect เข้ามา
import { protect } from "../middlewares/auth.middleware.js"; 

const router = Router();

const recommendSchema = z.object({
  selectedIngredients: z.array(
    z.object({
      ingredientId: z.string().optional(),
      name: z.string().optional(),
      grams: z.number().positive()
    })
  ).default([]),
  userPrompt: z.string().optional().default(""),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  servings: z.number().int().positive().default(1),
  language: z.string().optional().default("th")
});

// 👇 2. ใส่ protect คั่นไว้ตรงนี้ เพื่อบังคับให้ต้องล็อกอินก่อนถึงจะขอเมนูได้
router.post("/", protect, validate({ body: recommendSchema }), recommendMenus);

// 👇 3. ใส่ protect ให้ 2 ตัวนี้ด้วย (ถ้าในอนาคตจะทำหน้าประวัติเมนู)
router.post("/save", protect, saveRecipe);
router.get("/:id", protect, getRecipeById);

export default router;