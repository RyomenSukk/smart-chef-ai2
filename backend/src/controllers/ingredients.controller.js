import Ingredient from "../models/Ingredient.js";

export async function listIngredients(req, res, next) {
  try {
    const items = await Ingredient.find().sort({ name: 1 }).lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function createIngredient(req, res, next) {
  try {
    const { name, category, nutritionPer100g } = req.body || {};
    const created = await Ingredient.create({ name, category, nutritionPer100g });
    res.status(201).json({ item: created });
  } catch (err) {
    next(err);
  }
}
