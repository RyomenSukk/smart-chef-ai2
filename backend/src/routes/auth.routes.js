import express from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.middleware.js";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" })
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, { message: "OTP ต้องมี 6 หลัก" }),
  newPassword: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" })
});

router.post("/register", validate({ body: authSchema }), register);
router.post("/login", validate({ body: authSchema }), login);

router.post("/forgot-password", validate({ body: forgotPasswordSchema }), forgotPassword);
router.post("/reset-password", validate({ body: resetPasswordSchema }), resetPassword);

export default router;