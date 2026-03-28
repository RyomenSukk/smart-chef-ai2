<template>
  <div class="container" style="max-width: 400px; margin: 50px auto;">
    <h2>สมัครสมาชิก</h2>
    <form @submit.prevent="handleRegister" class="card">
      <label class="label">
        ชื่อ
        <input class="input" type="text" v-model="name" required placeholder="ชื่อของคุณ" />
      </label>
      
      <label class="label" style="margin-top: 10px;">
        Email
        <input class="input" type="email" v-model="email" required placeholder="อีเมล" />
      </label>
      
      <label class="label" style="margin-top: 10px;">
        Password
        <input class="input" type="password" v-model="password" required placeholder="รหัสผ่าน" />
      </label>
      
      <button class="btn" type="submit" :disabled="loading" style="margin-top: 20px; width: 100%;">
        {{ loading ? "กำลังสมัคร..." : "สมัครสมาชิก" }}
      </button>
      
      <p v-if="error" style="color: red; margin-top: 10px;">{{ error }}</p>
      
      <div style="margin-top: 15px; text-align: center;">
        <router-link to="/login" class="muted">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../api/client";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleRegister() {
  error.value = "";
  loading.value = true;
  try {
    const { data } = await api.post("/api/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    router.push("/");
  } catch (e) {
    error.value = e.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
  } finally {
    loading.value = false;
  }
}
</script>