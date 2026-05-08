<template>
  <div class="h-14 bg-gray-900 text-white flex justify-between items-center px-5">

    <h1 class="font-bold">Admin Panel</h1>

    <div class="flex gap-3">

      

      <button @click="logout" class="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>

    </div>

  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>