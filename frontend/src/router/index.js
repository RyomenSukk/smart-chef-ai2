import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminView from "../views/AdminView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
    { path: "/forgot-password", component: ForgotPasswordView },
    { 
      path: "/admin", 
      component: AdminView,
      meta: { requiresAdmin: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) {
    try { user = JSON.parse(userStr); } catch (e) {}
  }

  if (to.meta.requiresAdmin) {
    if (!user || user.role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      return next("/");
    }
  }
  next();
});

export default router;