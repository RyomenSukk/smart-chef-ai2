import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, default: "other" },
    // โภชนาการต่อ 100g (ไม่จำเป็นต้องครบทุกตัว)
    nutritionPer100g: {
      kcal: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Ingredient", IngredientSchema);
