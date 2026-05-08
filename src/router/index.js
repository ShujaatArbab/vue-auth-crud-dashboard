import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";

import Dashboard from "../pages/Dashboard.vue";
import Users from "../pages/Users.vue";
import Profile from "../pages/Profile.vue";

const routes = [
  { path: "/", redirect: "/login" },

  {
    path: "/login",
    component: Login,
    meta: { guestOnly: true } // ✅ ADDED
  },

  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "users", component: Users },
      { path: "profile", component: Profile }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ✅ FIXED GUARD
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("token");

  const isLoggedIn = !!token;

  // 🔒 BLOCK PRIVATE ROUTES
  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
  }

  // 🔒 BLOCK LOGIN PAGE IF ALREADY LOGGED IN
  else if (to.meta.guestOnly && isLoggedIn) {
    next("/dashboard");
  }

  else {
    next();
  }
});

export default router;