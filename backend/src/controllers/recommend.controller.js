import Ingredient from "../models/Ingredient.js";
import Recipe from "../models/Recipe.js";
import { buildRecommendationPrompt, recipeResponseSchema } from "../services/prompt.builder.js";
import { geminiGenerateJson } from "../services/gemini.service.js";
import { estimateCaloriesFromKnownNutrition } from "../services/nutrition.helper.js";

export async function recommendMenus(req, res, next) {
  try {
    const {
      selectedIngredients = [],
      userPrompt = "",
      difficulty = "easy",
      skillLevel = "beginner",
      servings = 1,
      language = "th"
    } = req.body || {};

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

    const aiJson = await geminiGenerateJson({
      prompt,
      schema: recipeResponseSchema
    });

    for (const r of aiJson.recipes || []) {
      r.calories_checked = estimateCaloriesFromKnownNutrition(r.ingredients_used || [], normalized);
    }

    if (aiJson && aiJson.recipes && aiJson.recipes.length > 0) {
      await Recipe.create({
        // 👇 เพิ่มบรรทัดนี้ เพื่อบอกว่า User คนไหนเป็นคนสุ่มเมนูนี้
        userId: req.user._id, 
        query: {
          userPrompt,
          difficulty,
          skillLevel,
          servings,
          ingredients: normalized
        },
        results: aiJson
      });
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

    if (String(doc.userId) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: ไม่ใช่ข้อมูลของคุณ" });
    }
    
    res.json({ item: doc });
  } catch (err) {
    next(err);
  }
}
