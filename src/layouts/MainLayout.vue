<template>
  <div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <Sidebar class="flex-shrink-0" />

    <!-- Right side -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">

      <!-- Navbar -->
      <Navbar class="flex-shrink-0" />

      <!-- Page Content -->
      <div class="p-5 bg-gray-100 flex-1 overflow-y-auto">
        <router-view />
      </div>

    </div>

  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

export default {
  components: {
    Navbar,
    Sidebar
  }
};
</script>