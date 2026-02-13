import express from "express";
import cors from "cors";
import helmet from "helmet";

import ingredientsRoutes from "./routes/ingredients.routes.js";
import recommendRoutes from "./routes/recommend.routes.js";
import imagesRoutes from "./routes/images.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/ingredients", ingredientsRoutes);
  app.use("/api/recommend", recommendRoutes);
  app.use("/api/images", imagesRoutes);

  app.use(errorMiddleware);
  return app;
}
