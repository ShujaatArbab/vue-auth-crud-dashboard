import { createRouter, createWebHistory } from "vue-router";

import Login      from "../pages/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Dashboard  from "../pages/Dashboard.vue";
import Users      from "../pages/Users.vue";
import Profile    from "../pages/Profile.vue";

// ✅ ViewUser import REMOVED — now shown in modal not page

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    component: Login,
    meta: { guestOnly: true },
  },

  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },

    children: [
      { path: "dashboard", component: Dashboard },
      { path: "users",     component: Users     },
      { path: "profile",   component: Profile   },
      // ✅ view-user route REMOVED — ViewUserModal handles it now
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// AUTH GUARD
router.beforeEach((to) => {
  const token     = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  if (to.meta.requiresAuth && !isLoggedIn) return "/login";
  if (to.meta.guestOnly   && isLoggedIn)   return "/dashboard";

  return true;
});

export default router;