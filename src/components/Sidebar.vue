<template>

  <!-- MOBILE OVERLAY -->
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-black/40 z-20 md:hidden"
    @click="closeMobile"
  ></div>

  <!-- SIDEBAR -->
  <div
    :class="[
      'fixed md:relative z-30 h-screen flex flex-col transition-all duration-300 text-white shadow-xl',

      isCollapsed ? 'md:w-16' : 'md:w-60',
      isMobileOpen ? 'w-60 translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
    style="background: linear-gradient(150deg, #14532d 0%, #166534 50%, #15803d 100%)"
  >

    <!-- TOP -->
    <div class="flex items-center justify-between p-3 border-b border-white/10">

      <span v-if="!isCollapsed" class="font-bold text-lg tracking-wide">
        AdminPanel
      </span>

      <button
        @click="toggleSidebar"
        class="hidden md:block p-2 hover:bg-white/10 rounded"
      >
        ☰
      </button>

      <button
        @click="closeMobile"
        class="md:hidden p-2 hover:bg-white/10 rounded ml-auto"
      >
        ✕
      </button>

    </div>

    <!-- NAVIGATION -->
    <nav class="flex flex-col gap-2 mt-4 px-2 flex-1">

      <!-- Dashboard -->
      <router-link
        v-if="role === 'admin'"
        to="/dashboard"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <LayoutDashboard class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed" class="text-sm">Dashboard</span>
      </router-link>

      <!-- Users -->
      <router-link
        v-if="role === 'admin'"
        to="/users"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <Users class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed" class="text-sm">Users</span>
      </router-link>

      <!-- Profile -->
      <router-link
        to="/profile"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <User class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed" class="text-sm">Profile</span>
      </router-link>
      <!--My Tasks-->
        <!-- My Tasks (USER ONLY) -->
<router-link
  v-if="isUser"
  to="/my-tasks"
  class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
  @click="closeMobile"
>
  <CheckSquare class="w-5 h-5 text-white" />
  <span v-if="!isCollapsed" class="text-sm">My Tasks</span>
</router-link>
      <!--Tasks-->
      <router-link
        v-if="role === 'admin'"
        to="/tasks"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <CheckSquare class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed" class="text-sm">Tasks</span>
      </router-link>

    </nav>

    <!-- LOGOUT -->
    <div class="p-2 border-t border-white/10">

      <button
        @click="logout"
        class="w-full flex items-center gap-3 p-2 rounded hover:bg-red-600 transition"
      >
        <LogOut class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed" class="text-sm">Logout</span>
      </button>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  CheckSquare
} from "lucide-vue-next";
import { computed } from "vue";
import { useSidebar } from "../composables/sidebar";
import { useAuthenticationStore } from "../store/Auth";
const { isCollapsed, toggleSidebar, logout } = useSidebar();

const isMobileOpen = ref(false);
const authStore = useAuthenticationStore();
const isAdmin = computed(() => authStore.user?.role === "admin");
const isUser = computed(() => authStore.user?.role === "user");
const role = computed(() => authStore.role)
const closeMobile = () => {
  isMobileOpen.value = false;
};

defineExpose({ isMobileOpen });
</script>