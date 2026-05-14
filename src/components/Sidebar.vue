<template>

  <!-- ✅ MOBILE OVERLAY — dark background when sidebar open on mobile -->
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-black/50 z-20 md:hidden"
    @click="closeMobile"
  ></div>

  <!-- SIDEBAR -->
  <div
    :class="[
      'fixed md:relative z-30 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300',
      // ✅ Desktop: collapsed or expanded
      isCollapsed ? 'md:w-16' : 'md:w-60',
      // ✅ Mobile: slide in/out from left
      isMobileOpen ? 'w-60 translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >

    <!-- Top -->
    <div class="flex items-center justify-between p-3 border-b border-gray-700">
      <span v-if="!isCollapsed" class="font-bold text-lg">MyApp</span>

      <!-- Toggle — hidden on mobile (navbar hamburger handles it) -->
      <button
        @click="toggleSidebar"
        class="hidden md:block p-2 hover:bg-gray-700 rounded"
      >
        <Menu class="w-5 h-5 text-white" />
      </button>

      <!-- Close button — only on mobile -->
      <button
        @click="closeMobile"
        class="md:hidden p-2 hover:bg-gray-700 rounded ml-auto"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-2 mt-4 px-2 flex-1">

      <router-link
        to="/dashboard"
        class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition"
        @click="closeMobile"
      >
        <LayoutDashboard class="w-5 h-5 text-white flex-shrink-0" />
        <span v-if="!isCollapsed" class="text-sm">Dashboard</span>
      </router-link>

      <router-link
        to="/users"
        class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition"
        @click="closeMobile"
      >
        <Users class="w-5 h-5 text-white flex-shrink-0" />
        <span v-if="!isCollapsed" class="text-sm">Users</span>
      </router-link>

      <router-link
        to="/profile"
        class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition"
        @click="closeMobile"
      >
        <User class="w-5 h-5 text-white flex-shrink-0" />
        <span v-if="!isCollapsed" class="text-sm">Profile</span>
      </router-link>

    </nav>

    <!-- Logout -->
    <div class="p-2 border-t border-gray-700">
      <button
        @click="logout"
        class="w-full flex items-center gap-3 p-2 rounded hover:bg-red-500 transition"
      >
        <LogOut class="w-5 h-5 text-white flex-shrink-0" />
        <span v-if="!isCollapsed" class="text-sm">Logout</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { Menu, LayoutDashboard, Users, User, LogOut } from "lucide-vue-next";
import { useSidebar } from "../composables/sidebar";

const { isCollapsed, toggleSidebar, logout } = useSidebar();

// ✅ Mobile open/close state
const isMobileOpen = ref(false);

const closeMobile = () => { isMobileOpen.value = false; };

// ✅ Expose so Navbar can open it
defineExpose({ isMobileOpen });
</script>