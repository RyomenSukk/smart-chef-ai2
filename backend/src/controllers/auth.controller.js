import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "ไม่พบอีเมลนี้ในระบบ" });

    // สร้าง OTP 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // เข้ารหัส OTP ก่อนเก็บลง DB เพื่อความปลอดภัย
    user.resetPasswordToken = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // หมดอายุใน 10 นาที
    await user.save();

    // ตั้งค่าผู้ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: `"Smart Chef AI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "รหัสรีเซ็ตรหัสผ่าน (OTP) - Smart Chef AI",
      text: `รหัส OTP สำหรับรีเซ็ตรหัสผ่านของคุณคือ: ${otp}\n\nรหัสนี้จะหมดอายุภายใน 10 นาที หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาละเว้นอีเมลฉบับนี้`,
    };

    await transporter.sendMail(message);
    res.status(200).json({ message: "ส่งรหัส OTP ไปที่อีเมลของคุณแล้ว" });

  } catch (error) {
    // 👇 แก้ 2 บรรทัดนี้ ให้มันปริ้นท์ Error ออกมาบอกเรา 👇
    console.error("❌ ข้อมูล Error จากการส่งอีเมล:", error);
    res.status(500).json({ message: error.message || "เกิดข้อผิดพลาดในการส่งอีเมล" });
  }
};

// 2. ตรวจสอบ OTP และตั้งรหัสผ่านใหม่
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // เข้ารหัส OTP ที่ส่งมาเพื่อเอาไปเทียบกับใน DB
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // ค้นหา User ที่อีเมลตรง, รหัสตรง และยังไม่หมดอายุ
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedOTP,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "รหัส OTP ไม่ถูกต้อง หรือหมดอายุแล้ว" });

    // เปลี่ยนรหัสผ่าน และเคลียร์ค่า OTP ทิ้ง
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "รีเซ็ตรหัสผ่านสำเร็จ สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้เลย" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};