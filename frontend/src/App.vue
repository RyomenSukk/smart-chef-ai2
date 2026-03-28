<template>
  <div>
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/">🍳 Smart Chef AI</router-link>
      </div>
      <div class="nav-links">
        <template v-if="isLoggedIn">
          <span class="user-name">สวัสดี, {{ userName }}</span>

          <router-link v-if="isAdmin" to="/admin" class="nav-item" style="color: #2e7d32;">
            ⚙️ จัดการวัตถุดิบ
          </router-link>

          <button @click="logout" class="btn-danger" style="padding: 4px 12px; font-size: 14px; margin-left: 10px;">ออกจากระบบ</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-item">เข้าสู่ระบบ</router-link>
          <router-link to="/register" class="nav-item">สมัครสมาชิก</router-link>
        </template>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);
const userName = ref('');
const isAdmin = ref(false);

watchEffect(() => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    const userObj = JSON.parse(userStr);
    isLoggedIn.value = true;
    userName.value = userObj.name;
    isAdmin.value = userObj.role === 'admin';
  } else {
    isLoggedIn.value = false;
    userName.value = '';
    isAdmin.value = false;
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  isAdmin.value = false;
  router.push('/login');
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #eae5df;
  margin-bottom: 24px;
}

.nav-brand a {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-item {
  color: #e65100;
  text-decoration: none;
  font-weight: 500;
}

.nav-item:hover {
  text-decoration: underline;
}

.user-name {
  color: #666;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>