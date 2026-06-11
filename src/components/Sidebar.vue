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
        {{ isAdmin ? "Admin Side" : "User Side" }}
      </span>

      <!-- Toggle — desktop only -->
      <button
        @click="toggleSidebar"
        class="hidden md:block p-2 hover:bg-white/10 rounded"
      >
        <i class="fa-solid fa-bars text-white text-base"></i>
      </button>

      <!-- Close — mobile only -->
      <button
        @click="closeMobile"
        class="md:hidden p-2 hover:bg-white/10 rounded ml-auto"
      >
        <i class="fa-solid fa-xmark text-white text-base"></i>
      </button>
    </div>

    <!-- NAVIGATION -->
    <nav class="flex flex-col gap-1 mt-4 px-2 flex-1">

      <!-- Dashboard — admin only -->
      <router-link
        v-if="isAdmin"
        to="/dashboard"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <i class="fa-solid fa-gauge w-5 text-center text-white text-sm"></i>
        <span v-if="!isCollapsed" class="text-sm">Dashboard</span>
      </router-link>

      <!-- Users — admin only -->
      <router-link
        v-if="isAdmin"
        to="/users"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <i class="fa-solid fa-users w-5 text-center text-white text-sm"></i>
        <span v-if="!isCollapsed" class="text-sm">Users</span>
      </router-link>

      <!-- Profile — all roles -->
      <router-link
        to="/profile"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <i class="fa-solid fa-user w-5 text-center text-white text-sm"></i>
        <span v-if="!isCollapsed" class="text-sm">Profile</span>
      </router-link>

      <!-- My Tasks — user only -->
      <router-link
        v-if="isUser"
        to="/my-tasks"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <i class="fa-solid fa-list-check w-5 text-center text-white text-sm"></i>
        <span v-if="!isCollapsed" class="text-sm">My Tasks</span>
      </router-link>

      <!-- Tasks — admin only -->
      <router-link
        v-if="isAdmin"
        to="/tasks"
        class="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
        @click="closeMobile"
      >
        <i class="fa-solid fa-square-check w-5 text-center text-white text-sm"></i>
        <span v-if="!isCollapsed" class="text-sm">Tasks</span>
      </router-link>

    </nav>

    <!-- LOGOUT -->
<div class="p-2 border-t border-white/10">
  <button
    @click="logout"
    class="w-full flex items-center gap-3 p-2 rounded hover:bg-red-600 transition"
  >
    <i class="fa-solid fa-right-from-bracket w-5 text-center text-white text-sm"></i>
    <span v-if="!isCollapsed" class="text-sm">Logout</span>
  </button>
</div>



  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSidebar } from "../composables/sidebar";
import { useAuthenticationStore } from "../store/Auth";
const {
  isCollapsed,
  toggleSidebar,
  logout,
 
} = useSidebar();

const isMobileOpen = ref(false);

const authStore  = useAuthenticationStore();

// FIXED: role from user object not authStore.role
const isAdmin = computed(() => authStore.user?.role === "admin");
const isUser  = computed(() => authStore.user?.role === "user");

const closeMobile = () => {
  isMobileOpen.value = false;
};

defineExpose({ isMobileOpen });
</script>