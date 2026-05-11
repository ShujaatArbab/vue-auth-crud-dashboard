<template>
  <div class="p-6 space-y-6">

    <!-- Title -->
    <h2 class="text-3xl font-bold text-gray-800">
      Dashboard
    </h2>

    <!-- Welcome Card -->
    <div class="bg-gradient-to-r bg-red-500 text-white p-6 rounded-xl shadow-lg">
      <h3 class="text-xl font-semibold">
        Welcome Back 
      </h3>

      <p class="mt-2 text-sm opacity-90">
        Manage users, view stats, and control your system from here.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

      <div class="bg-white p-5 rounded-xl shadow border">
        <p class="text-gray-500">Total Users</p>
        <h3 class="text-2xl font-bold text-blue-600">150</h3>
      </div>

      <div class="bg-white p-5 rounded-xl shadow border">
        <p class="text-gray-500">Active Sessions</p>
        <h3 class="text-2xl font-bold text-green-600">23</h3>
      </div>

      <div class="bg-white p-5 rounded-xl shadow border">
        <p class="text-gray-500">New Signups</p>
        <h3 class="text-2xl font-bold text-purple-600">12</h3>
      </div>

    </div>

    <!-- Logged User Info -->
    <div v-if="user" class="bg-white p-6 rounded-xl shadow border">

      <h3 class="text-lg font-semibold mb-3">
        Logged In User
      </h3>

      <p><b>Name:</b> {{ user.firstName }} {{ user.lastName }}</p>
      <p><b>Email:</b> {{ user.email }}</p>

    </div>

    <!-- ✅ ADDED: Activity Chart -->
    <div class="bg-white p-6 rounded-xl shadow border">

      <h3 class="text-lg font-semibold mb-4">
        User Activity (Last 7 Days)
      </h3>

      <div class="flex items-end gap-3 h-40">

        <div
          v-for="(h, i) in chartData"
          :key="i"
          class="flex flex-col items-center flex-1"
        >
          <div
            class="w-6 bg-blue-500 rounded-t"
            :style="{ height: h + 'px' }"
          ></div>

          <span class="text-xs text-gray-500 mt-2">
            {{ days[i] }}
          </span>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null,

      // ✅ chart data (added only)
      chartData: [60, 120, 80, 150, 90, 110, 70],
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };
  },

  async mounted() {
    const token = sessionStorage.getItem("token");

    try {
      const res = await axios.get("https://dummyjson.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.user = res.data;
    } catch (err) {
      console.log("Error loading user");
    }
  },
};
</script>