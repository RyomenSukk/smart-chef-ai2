import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ดึงข้อมูล User จาก Database
      req.user = await User.findById(decoded.id).select("-password");
      
      // กันเหนียว: ถ้า Token ถูก แต่ User โดนลบไปแล้ว ให้เด้งออก
      if (!req.user) {
        return res.status(401).json({ message: "ไม่พบผู้ใช้งานนี้ในระบบ กรุณาล็อกอินใหม่" });
      }

      // ส่งไม้ต่อให้ทำงานขั้นถัดไป (ต้องมี return)
      return next(); 
    } catch (error) {
      // ถ้า Token หมดอายุ หรือถอดรหัสไม่ได้ (ต้องมี return)
      return res.status(401).json({ message: "Token ไม่ถูกต้อง หรือหมดอายุ" });
    }
  }

  if (!token) {
    // ถ้าไม่ได้แนบ Token มาเลย (ต้องมี return)
    return res.status(401).json({ message: "ไม่พบ Token กรุณา Login" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // (ใส่ return ให้เป็นนิสัยครับ)
  } else {
    return res.status(403).json({ message: "Access Denied: คุณไม่มีสิทธิ์ใช้งานในส่วนนี้ (Admin Only)" });
  }
};