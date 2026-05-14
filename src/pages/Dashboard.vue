<template>
  <div class="p-3 sm:p-5 bg-zinc-100 min-h-screen flex flex-col gap-3 font-sans">

    <!-- HEADER -->
    <div class="flex justify-between items-center bg-white border border-zinc-200 rounded-xl px-5 py-3">
      <div>
        <h2 class="text-xl font-bold text-zinc-900">Dashboard</h2>
        <p class="text-xs text-zinc-400 mt-0.5">Analytics Overview</p>
      </div>
      <div v-if="user" class="text-xs font-semibold bg-zinc-100 border border-zinc-200 px-4 py-1.5 rounded-full text-zinc-600">
        👤 {{ user.firstName }} {{ user.lastName }} &nbsp;·&nbsp; {{ user.role }}
      </div>
    </div>

    <!-- ROW LABEL: OVERVIEW -->
    <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-0.5">Overview</p>

    <!-- ROW 1: 4 CARDS -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Total Users</span>
        <strong class="text-4xl font-bold text-blue-600">{{ totalUsers }}</strong>
      </div>

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Male Users</span>
        <strong class="text-4xl font-bold text-indigo-600">{{ maleUsers }}</strong>
      </div>

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Female Users</span>
        <strong class="text-4xl font-bold text-pink-600">{{ femaleUsers }}</strong>
      </div>

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Young (Age 25 below)</span>
        <strong class="text-4xl font-bold text-green-600">{{ youngUsers }}</strong>
      </div>

    </div>

    <!-- ROW LABEL: ROLES -->
    <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-0.5">Roles & Age Groups</p>

    <!-- ROW 2: 5 CARDS -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Admins</span>
        <strong class="text-4xl font-bold text-red-600">{{ adminUsers }}</strong>
      </div>

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Moderators</span>
        <strong class="text-2xl sm:text-4xl font-bold text-orange-600">{{ moderatorUsers }}</strong>
      </div>

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Regular Users</span>
        <strong class="text-4xl font-bold text-blue-600">{{ regularUsers }}</strong>
      </div>

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Middle Age (26–45)</span>
        <strong class="text-4xl font-bold text-yellow-600">{{ midUsers }}</strong>
      </div>

      <div class="card bg-white border border-zinc-200 rounded-xl px-5 py-4 flex flex-col gap-1.5">
        <span class="text-sm text-zinc-500 font-medium">Senior (46 above)</span>
        <strong class="text-4xl font-bold text-red-600">{{ seniorUsers }}</strong>
      </div>

    </div>

  </div>
</template>

<script>
import { onMounted } from "vue";
import gsap from "gsap";
import { useDashboard } from "../composables/useDashboard";

export default {
  setup() {
    const {
      user,
      totalUsers,
      maleUsers, femaleUsers,
      adminUsers, moderatorUsers, regularUsers,
      youngUsers, midUsers, seniorUsers,
      hairColors,
      fetchDashboard,
    } = useDashboard();

    fetchDashboard();

    onMounted(() => {
      gsap.from(".card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out"
      });
    });

    return {
      user,
      totalUsers,
      maleUsers, femaleUsers,
      adminUsers, moderatorUsers, regularUsers,
      youngUsers, midUsers, seniorUsers,
      hairColors,
    };
  },
};
</script>