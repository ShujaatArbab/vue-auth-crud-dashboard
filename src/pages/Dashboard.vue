<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6">

    <!-- HEADER -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
      <p class="text-sm text-gray-500">User Analytics Overview</p>
    </div>

    <!-- USER INFO CARD -->
    <div v-if="user" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

      <div class="flex items-center gap-4 mb-6">
        <div class="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold shadow">
          {{ user.username?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-800">{{ user.first_name }} {{ user.last_name }}</h2>
          <p class="text-sm text-gray-400">Logged in User</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- ID -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">User ID</p>
          <p class="text-sm font-semibold text-gray-800"># {{ user.id }}</p>
        </div>

        <!-- USERNAME -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Username</p>
          <p class="text-sm font-semibold text-gray-800">{{ user.username }}</p>
        </div>

        <!-- EMAIL -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
          <p class="text-sm font-semibold text-gray-800 truncate">{{ user.email }}</p>
        </div>

        <!-- DATE JOINED -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Date Joined</p>
          <p class="text-sm font-semibold text-gray-800">{{ formatDate(user.date_joined) }}</p>
        </div>

      </div>
    </div>

    <!-- STATS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <!-- TOTAL USERS -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <p class="text-gray-500 text-sm font-medium">Total Users</p>
          <span class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">All</span>
        </div>
        <h2 class="text-3xl font-bold text-blue-600">{{ totalUsers }}</h2>
      </div>

      <!-- MALE -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <p class="text-gray-500 text-sm font-medium">Male Users</p>
          <span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">Male</span>
        </div>
        <h2 class="text-3xl font-bold text-indigo-600">{{ maleUsers }}</h2>
      </div>

      <!-- FEMALE -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <p class="text-gray-500 text-sm font-medium">Female Users</p>
          <span class="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full font-medium">Female</span>
        </div>
        <h2 class="text-3xl font-bold text-pink-600">{{ femaleUsers }}</h2>
      </div>

    </div>

  </div>
</template>

<script>
import { onMounted } from "vue";
import { useDashboard } from "../composables/useDashboard";

export default {
  setup() {

    const {
      user,
      totalUsers,
      maleUsers,
      femaleUsers,
      fetchDashboard,
    } = useDashboard();

    fetchDashboard();

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    onMounted(() => {
      const cards = document.querySelectorAll(".grid > div");
      cards.forEach((card, i) => {
        card.style.opacity = 0;
        card.style.transform = "translateY(10px)";
        setTimeout(() => {
          card.style.transition = "all 0.4s ease";
          card.style.opacity = 1;
          card.style.transform = "translateY(0)";
        }, i * 80);
      });
    });

    return {
      user,
      totalUsers,
      maleUsers,
      femaleUsers,
      formatDate,
    };
  },
};
</script>