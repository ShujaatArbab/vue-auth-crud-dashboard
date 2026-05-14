<template>
  <div class="flex h-screen overflow-hidden">

    <!-- SIDEBAR -->
    <Sidebar ref="sidebarRef" />

    <!-- MAIN -->
    <div class="flex flex-col flex-1 overflow-hidden">

      <!-- NAVBAR — passes toggle event to sidebar -->
      <Navbar @toggle-sidebar="sidebarRef.isMobileOpen = true" />

      <!-- PAGE CONTENT -->
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "../components/Sidebar.vue";
import Navbar  from "../components/Navbar.vue";

const sidebarRef = ref(null);
</script>