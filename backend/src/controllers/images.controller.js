import { imagenGenerateBase64 } from "../services/gemini.service.js";

export async function generateFoodImage(req, res, next) {
  try {
    const { imagePrompt } = req.body || {};
    if (!imagePrompt || String(imagePrompt).trim().length < 5) {
      return res.status(400).json({ message: "imagePrompt required" });
    }

    const b64 = await imagenGenerateBase64({ prompt: imagePrompt });
    res.json({ base64: b64 });
  } catch (err) {
    next(err);
  }
}
