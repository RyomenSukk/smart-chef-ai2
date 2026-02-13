import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../.env");
const result = dotenv.config({ path: envPath });

console.log("ENV PATH:", envPath);
console.log("DOTENV ERROR:", result.error);
console.log("DOTENV PARSED:", result.parsed);
console.log("DEBUG GEMINI KEY:", process.env.GEMINI_API_KEY);

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("❌ GEMINI_API_KEY ยังไม่ถูกอ่านจาก .env");
}

const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-=2.5-flash";
const IMAGEN_MODEL = process.env.IMAGEN_MODEL || "imagen-3.0-generate-002";

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function geminiGenerateJson({ prompt, schema }) {
  const resp = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.6
    }
  });

  const text = resp?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  try {
    return JSON.parse(text);
  } catch {
    return { recipes: [], raw: text };
  }
}

export async function imagenGenerateBase64({ prompt }) {
  const resp = await ai.models.generateImages({
    model: IMAGEN_MODEL,
    prompt,
    config: { numberOfImages: 1 }
  });

  const b64 = resp?.generatedImages?.[0]?.image?.imageBytes;
  if (!b64) throw new Error("No imageBytes returned from Imagen");
  return b64;
}
