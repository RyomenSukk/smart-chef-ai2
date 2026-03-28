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

export async function updateIngredient(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await Ingredient.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "ไม่พบวัตถุดิบนี้" });
    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteIngredient(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Ingredient.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "ไม่พบวัตถุดิบนี้" });
    res.json({ message: "ลบวัตถุดิบเรียบร้อยแล้ว" });
  } catch (err) {
    next(err);
  }
}
