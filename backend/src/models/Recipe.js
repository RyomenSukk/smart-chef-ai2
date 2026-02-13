import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    query: {
      userPrompt: { type: String, default: "" },
      difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
      skillLevel: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
      servings: { type: Number, default: 1 },
      ingredients: [
        {
          ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
          name: String,
          grams: Number
        }
      ]
    },
    results: { type: Object, required: true } // JSON ทั้งก้อนจาก Gemini
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", RecipeSchema);
