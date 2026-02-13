export function estimateCaloriesFromKnownNutrition(ingredients_used, normalizedSelected) {
  // ถ้า ingredient ตรงกับที่เรามี nutritionPer100g ใน DB จะคำนวณ kcal ให้
  let kcal = 0;

  for (const u of ingredients_used || []) {
    const name = String(u.name || "").toLowerCase().trim();
    const grams = Number(u.grams || 0);

    const ref = normalizedSelected.find(x => String(x.name || "").toLowerCase().trim() === name);
    const per100 = ref?.nutritionPer100g?.kcal;

    if (per100 && grams > 0) {
      kcal += (per100 * grams) / 100;
    }
  }

  return Math.round(kcal);
}
