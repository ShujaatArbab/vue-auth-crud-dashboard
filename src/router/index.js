import { createRouter, createWebHistory } from "vue-router";

import Login      from "../pages/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Dashboard  from "../pages/Dashboard.vue";
import Users      from "../pages/Users.vue";
import Profile    from "../pages/Profile.vue";
import Signup from "../pages/Signup.vue";
import Tasks from '../pages/Tasks.vue'



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
    path: "/signup",
    name: "signup",
    component: Signup
    
  },

  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },


    children: [
  { path: "dashboard", component: Dashboard },
  { path: "users", component: Users },
  { path: "profile", component: Profile },
  { path: "tasks", component: Tasks },

  {
    path: "my-tasks",
    name: "MyTasks",
    component: () => import("../pages/MyTasks.vue"),
    meta: { requiresAuth: true, roles: ["user"] }
  },
]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// AUTH GUARD
router.beforeEach((to) => {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");

  const role = auth?.user?.role?.toLowerCase();
  const token = sessionStorage.getItem("access");

  const isLoggedIn = !!token;

  if (to.meta.requiresAuth && !isLoggedIn) {
    return "/login";
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return "/dashboard";
  }

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return "/profile";
  }

  return true;
});
export default router;