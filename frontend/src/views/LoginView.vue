<template>
  <div class="container" style="max-width: 400px; margin: 50px auto;">
    <h2>เข้าสู่ระบบ</h2>
    <form @submit.prevent="handleLogin" class="card">
      <label class="label">
        Email
        <input class="input" type="email" v-model="email" required placeholder="อีเมลของคุณ" />
      </label>

      <label class="label" style="margin-top: 10px;">
        Password
        <input class="input" type="password" v-model="password" required placeholder="รหัสผ่าน" />
      </label>

      <button class="btn" type="submit" :disabled="loading" style="margin-top: 20px; width: 100%;">
        {{ loading ? "กำลังเข้าสู่ระบบ..." : "Login" }}
      </button>

      <p v-if="error" style="color: red; margin-top: 10px;">{{ error }}</p>

      <div style="text-align: right; margin-top: 8px;">
        <router-link to="/forgot-password" style="font-size: 0.85rem; color: #e65100;">ลืมรหัสผ่าน?</router-link>
      </div>

      <div style="margin-top: 15px; text-align: center;">
        <router-link to="/register" class="muted">ยังไม่มีบัญชี? สมัครสมาชิก</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../api/client";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleLogin() {
  error.value = "";
  loading.value = true;
  try {
    const { data } = await api.post("/api/auth/login", {
      email: email.value,
      password: password.value
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    // พากลับไปที่หน้าแรก
    router.push("/");
  } catch (e) {
    error.value = e.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  } finally {
    loading.value = false;
  }
}
</script>