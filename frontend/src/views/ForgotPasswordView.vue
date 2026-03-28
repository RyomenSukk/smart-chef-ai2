<template>
  <div class="container" style="max-width: 400px; margin: 50px auto;">
    <h2>รีเซ็ตรหัสผ่าน</h2>
    
    <form v-if="step === 1" @submit.prevent="requestOTP" class="card">
      <p style="font-size: 0.9rem; color: #666;">กรุณากรอกอีเมลที่ใช้สมัครสมาชิก ระบบจะส่งรหัส OTP ไปให้</p>
      
      <label class="label">
        Email
        <input class="input" type="email" v-model="email" required placeholder="อีเมลของคุณ" />
      </label>
      
      <button class="btn" type="submit" :disabled="loading" style="margin-top: 20px; width: 100%;">
        {{ loading ? "กำลังส่ง..." : "ขอรหัส OTP" }}
      </button>
      
      <p v-if="message" style="color: green; margin-top: 10px;">{{ message }}</p>
      <p v-if="error" style="color: red; margin-top: 10px;">{{ error }}</p>
    </form>

    <form v-else @submit.prevent="submitNewPassword" class="card">
      <p style="font-size: 0.9rem; color: #666;">ส่งรหัส OTP ไปที่ {{ email }} แล้ว</p>
      
      <label class="label">
        รหัส OTP 6 หลัก
        <input class="input" type="text" v-model="otp" required placeholder="123456" maxlength="6" />
      </label>

      <label class="label" style="margin-top: 10px;">
        รหัสผ่านใหม่
        <input class="input" type="password" v-model="newPassword" required placeholder="รหัสผ่านใหม่อย่างน้อย 6 ตัว" minlength="6" />
      </label>
      
      <button class="btn" type="submit" :disabled="loading" style="margin-top: 20px; width: 100%;">
        {{ loading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน" }}
      </button>
      
      <p v-if="error" style="color: red; margin-top: 10px;">{{ error }}</p>
    </form>
    
    <div style="margin-top: 15px; text-align: center;">
      <router-link to="/login" class="muted">กลับไปหน้าเข้าสู่ระบบ</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../api/client";

const router = useRouter();
const step = ref(1);
const email = ref("");
const otp = ref("");
const newPassword = ref("");
const loading = ref(false);
const error = ref("");
const message = ref("");

async function requestOTP() {
  error.value = ""; message.value = ""; loading.value = true;
  try {
    const { data } = await api.post("/api/auth/forgot-password", { email: email.value });
    message.value = data.message;
    step.value = 2; // เปลี่ยนหน้าจอไปให้กรอก OTP
  } catch (e) {
    error.value = e.response?.data?.message || "เกิดข้อผิดพลาด";
  } finally {
    loading.value = false;
  }
}

async function submitNewPassword() {
  error.value = ""; loading.value = true;
  try {
    await api.post("/api/auth/reset-password", {
      email: email.value,
      otp: otp.value,
      newPassword: newPassword.value
    });
    alert("รีเซ็ตรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");
    router.push("/login");
  } catch (e) {
    error.value = e.response?.data?.message || "OTP ไม่ถูกต้อง";
  } finally {
    loading.value = false;
  }
}
</script>