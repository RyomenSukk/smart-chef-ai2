import Ingredient from "../models/Ingredient.js";
import Recipe from "../models/Recipe.js";
import { buildRecommendationPrompt, recipeResponseSchema } from "../services/prompt.builder.js";
import { geminiGenerateJson } from "../services/gemini.service.js";
import { estimateCaloriesFromKnownNutrition } from "../services/nutrition.helper.js";

export async function recommendMenus(req, res, next) {
  try {
    const {
      selectedIngredients = [], // [{ingredientId, grams}] หรือ [{name, grams}]
      userPrompt = "",
      difficulty = "easy",
      skillLevel = "beginner",
      servings = 1,
      language = "th"
    } = req.body || {};

    // ดึงข้อมูล ingredient จาก DB เพื่อเอา nutritionPer100g + ชื่อมาตรฐาน
    const ids = selectedIngredients.filter(x => x.ingredientId).map(x => x.ingredientId);
    const dbIngredients = ids.length
      ? await Ingredient.find({ _id: { $in: ids } }).lean()
      : [];

    const normalized = selectedIngredients.map((x) => {
      const found = x.ingredientId
        ? dbIngredients.find(d => String(d._id) === String(x.ingredientId))
        : null;

      return {
        ingredientId: x.ingredientId || null,
        name: (found?.name || x.name || "").trim(),
        grams: Number(x.grams || 0),
        nutritionPer100g: found?.nutritionPer100g || null
      };
    }).filter(x => x.name && x.grams > 0);

    const prompt = buildRecommendationPrompt({
      language,
      difficulty,
      skillLevel,
      servings,
      userPrompt,
      ingredients: normalized
    });

    // ให้ Gemini คืน JSON ตาม schema
    const aiJson = await geminiGenerateJson({
      prompt,
      schema: recipeResponseSchema
    });

    // เสริม: คำนวณแคลอรี่แบบ deterministic จาก nutrition ที่เรามี (ถ้ามี) เพื่อ “เช็ค sanity”
    // แล้วใส่กลับไปเป็น field เพิ่มเติม (ไม่บังคับ)
    for (const r of aiJson.recipes || []) {
      r.calories_checked = estimateCaloriesFromKnownNutrition(r.ingredients_used || [], normalized);
    }

    res.json({ data: aiJson });
  } catch (err) {
    next(err);
  }
}

export async function saveRecipe(req, res, next) {
  try {
    const payload = req.body || {};
    const doc = await Recipe.create(payload);
    res.status(201).json({ id: doc._id });
  } catch (err) {
    next(err);
  }
}

export async function getRecipeById(req, res, next) {
  try {
    const doc = await Recipe.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ item: doc });
  } catch (err) {
    next(err);
  }
}
