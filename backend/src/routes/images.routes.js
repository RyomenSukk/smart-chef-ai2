import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.middleware.js";
import { generateFoodImage } from "../controllers/images.controller.js";

const router = Router();

const imageSchema = z.object({
  imagePrompt: z.string().min(5)
});

router.post("/generate", validate({ body: imageSchema }), generateFoodImage);

export default router;
