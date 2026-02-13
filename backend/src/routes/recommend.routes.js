import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.middleware.js";
import { recommendMenus, saveRecipe, getRecipeById } from "../controllers/recommend.controller.js";

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

router.post("/", validate({ body: recommendSchema }), recommendMenus);

// save/get ยังไม่บังคับก็ได้ (แล้วแต่จะทำต่อ)
router.post("/save", saveRecipe);
router.get("/:id", getRecipeById);

export default router;
