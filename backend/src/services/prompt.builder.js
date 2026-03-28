// responseSchema แบบ OpenAPI-ish ที่ Gemini รองรับ (structured outputs) :contentReference[oaicite:4]{index=4}
export const recipeResponseSchema = {
  type: "object",
  properties: {
    recipes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
          servings: { type: "number" },
          time_minutes: { type: "number" },
          calories_estimate: { type: "number" },
          ingredients_used: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                grams: { type: "number" }
              },
              required: ["name", "grams"]
            }
          },
          missing_ingredients: { type: "array", items: { type: "string" } },
          steps: { type: "array", items: { type: "string" } },
          tips_for_skill_level: { type: "array", items: { type: "string" } },
          image_prompt: { type: "string" }
        },
        required: ["name", "difficulty", "servings", "time_minutes", "calories_estimate", "ingredients_used", "steps", "image_prompt"]
      }
    },
    warnings: { type: "array", items: { type: "string" } }
  },
  required: ["recipes"]
};

export function buildRecommendationPrompt({
  language = "th",
  difficulty,
  skillLevel,
  servings,
  userPrompt,
  ingredients
}) {
  const ingredientLines = ingredients.map(i => `- ${i.name}: ${i.grams}g`).join("\n");

  return `
คุณคือผู้ช่วยเชฟและนักโภชนาการ
งานของคุณ: แนะนำเมนูที่ทำได้จากวัตถุดิบที่มี (และระบุของที่ขาดได้)
เงื่อนไขสำคัญ:
- ระดับความยากที่ต้องการ: ${difficulty}
- ระดับทักษะผู้ใช้: ${skillLevel}
- จำนวนเสิร์ฟ: ${servings}
- ผู้ใช้อาจพิมพ์เพิ่มเติม: ${userPrompt || "(ไม่มี)"}
- ต้องให้ผลลัพธ์ "เป็น JSON เท่านั้น" และตรงตาม schema ที่ระบบกำหนด
- ทุกเมนูต้องมี: ชื่อเมนู, เวลาโดยประมาณ, แคลอรี่โดยประมาณ (ต่อ 1 เสิร์ฟ), วัตถุดิบที่ใช้พร้อมกรัม, ขั้นตอนทำเป็นข้อ, ทิปส์ตาม skill level
- สร้าง image_prompt ภาษาอังกฤษแบบชัดเจนสำหรับสร้างรูปอาหาร (มุมมอง, แสง, ฉาก, สไตล์ realistic food photography)
- แนะนำ 3-6 เมนู
- ถ้ามีข้อควรระวัง (เช่น วัตถุดิบเสี่ยงแพ้/ดิบ) ใส่ใน warnings

วัตถุดิบที่มี:
${ingredientLines}

ตอบกลับเป็นภาษาไทยใน field ข้อความ (ยกเว้น image_prompt เป็นอังกฤษ)
`;
}
