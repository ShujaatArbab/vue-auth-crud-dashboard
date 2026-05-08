<template>
  <div class="flex">

    <Sidebar />

    <div class="flex-1 flex flex-col min-h-screen">

      <Navbar />

      <div class="p-5 bg-gray-100 flex-1">
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