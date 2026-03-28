import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import Ingredient from "../models/Ingredient.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// อ่านไฟล์ JSON แบบ manual
const seedPath = path.join(__dirname, "ingredients.seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

async function run() {
  await connectDB(process.env.MONGODB_URI);
  await Ingredient.deleteMany({});
  await Ingredient.insertMany(seed);
  console.log("✅ Seeded ingredients:", seed.length);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
