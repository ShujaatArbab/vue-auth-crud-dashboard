<template>
  <div>
    <div class="flex h-screen overflow-hidden">
      <Sidebar ref="sidebarRef" />

      <div class="flex flex-col flex-1 overflow-hidden">
        <Navbar @toggle-sidebar="sidebarRef.isMobileOpen = true" />

        <main class="flex-1 overflow-y-auto">
          <router-view />
        </main>
      </div>
    </div>

   <ConfirmModel
  :isOpen="sidebar.showLogoutModal.value"
  @close="sidebar.closeLogoutModal"
  @confirm="sidebar.confirmLogout"
/>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import ConfirmModel from "../components/ConfirmModel.vue";
import { useSidebar } from "../composables/sidebar.js";

const sidebarRef = ref(null);
const sidebar = useSidebar();
</script>