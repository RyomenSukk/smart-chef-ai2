import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDB(process.env.MONGODB_URI);
  const app = createServer();
  app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

console.log("API KEY exists?", !!process.env.GEMINI_API_KEY);

