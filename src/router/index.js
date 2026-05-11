import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";

import Dashboard from "../pages/Dashboard.vue";
import Users from "../pages/Users.vue";
import Profile from "../pages/Profile.vue";
import AddUser from "../pages/AddUser.vue";
import EditUser from "../pages/EditUser.vue";
import ViewUser from "../pages/ViewUser.vue";

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
      { path: "users", component: Users },
      { path: "profile", component: Profile },
      { path: "add-user", component: AddUser },
      { path: "edit-user/:id", component: EditUser },
      { path: "view-user/:id", component: ViewUser },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ MODERN GUARD (NO next())
router.beforeEach((to) => {
  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  if (to.meta.requiresAuth && !isLoggedIn) {
    return "/login";
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return "/dashboard";
  }

  return true;
});

export default router;