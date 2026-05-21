<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6">

    <!-- HEADER -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
      <p class="text-sm text-gray-500">User Analytics Overview</p>
    </div>

    <!-- USER CARD -->
    <div v-if="user" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

      <!-- TOP USER -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
          {{ user.username?.charAt(0).toUpperCase() }}
        </div>

        <div>
          <h2 class="text-lg font-bold text-gray-800">
            {{ user.first_name }} {{ user.last_name }}
          </h2>
          <p class="text-sm text-gray-400">Logged in User</p>
        </div>
      </div>

      <!-- GRID (UNCHANGED WIDTH) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- USERNAME -->
        <div class="bg-gray-50 rounded-xl p-4 border">
          <p class="text-xs text-gray-400 mb-1">Username</p>
          <p class="text-sm font-semibold">{{ user.username }}</p>
        </div>

        <!-- EMAIL -->
        <div class="bg-gray-50 rounded-xl p-4 border">
          <p class="text-xs text-gray-400 mb-1">Email</p>
          <p class="text-sm font-semibold truncate">{{ user.email }}</p>
        </div>

        <!-- DATE -->
        <div class="bg-gray-50 rounded-xl p-4 border">
          <p class="text-xs text-gray-400 mb-1">Date Joined</p>
          <p class="text-sm font-semibold">{{ formatDate(user.date_joined) }}</p>
        </div>

      </div>

            <!-- CHART + TOTAL USERS ROW -->
      <!-- CHART + STATS ROW -->
<div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

  <!-- CHART -->
  <div class="bg-gray-50 rounded-xl p-4 border">
    <p class="text-xs text-gray-400 mb-2">User Split</p>

    <div class="h-28">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>

  <!-- TOTAL USERS -->
  <div class="bg-white p-5 rounded-xl border flex flex-col justify-center">
    <p class="text-sm text-gray-500">Total Users</p>
    <h2 class="text-2xl font-bold text-blue-600">{{ totalUsers }}</h2>
  </div>

  <!-- MALE USERS -->
  <div class="bg-white p-5 rounded-xl border flex flex-col justify-center">
    <p class="text-sm text-gray-500">Male Users</p>
    <h2 class="text-2xl font-bold text-indigo-600">{{ maleUsers }}</h2>
  </div>

  <!-- FEMALE USERS -->
  <div class="bg-white p-5 rounded-xl border flex flex-col justify-center">
    <p class="text-sm text-gray-500">Female Users</p>
    <h2 class="text-2xl font-bold text-pink-600">{{ femaleUsers }}</h2>
  </div>

</div>
      

    </div>

  </div>
</template>
<script>
import { onMounted, ref, nextTick } from "vue";
import { useDashboard } from "../composables/useDashboard";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  setup() {

    const {
      user,
      totalUsers,
      maleUsers,
      femaleUsers,
      fetchDashboard,
    } = useDashboard();

    const chartRef = ref(null);
    let chartInstance = null;

    fetchDashboard();

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString();
    };

    const renderChart = async () => {
      await nextTick();

      if (!chartRef.value) return;

      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(chartRef.value, {
        type: "doughnut",
        data: {
          labels: ["Male", "Female"],
          datasets: [{
            data: [maleUsers.value, femaleUsers.value],
            backgroundColor: ["#4f46e5", "#ec4899"],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    };

    onMounted(async () => {
      await fetchDashboard();
      await renderChart();
    });

    return {
      user,
      totalUsers,
      maleUsers,
      femaleUsers,
      formatDate,
      chartRef,
    };
  }
};
</script>