<template>
  <div class="min-h-screen w-full bg-gray-50 p-3">

    <!-- CARD -->
    <div v-if="user" class="w-full bg-white rounded-2xl border shadow-sm overflow-hidden">

      <!-- HERO -->
      <div class="bg-slate-900 px-6 pt-5 pb-2 flex items-end gap-4">

        <!-- AVATAR -->
        <div
          class="w-16 h-16 rounded-full bg-slate-700 border-2 border-white/10 overflow-hidden flex items-center justify-center text-white font-semibold text-lg"
        >
          <img
            v-if="user.image"
            :src="user.image"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ initials }}</span>
        </div>

        <!-- NAME -->
        <div class="flex-1 pb-2">
          <div class="text-white font-semibold text-lg">
            {{ user.firstName }} {{ user.lastName }}
          </div>
          <div class="text-xs text-slate-400">
            {{ subtitle }}
          </div>
        </div>

        <!-- ROLE / STATUS -->
        <div class="pb-2 flex flex-col items-end gap-1">
          <span class="text-[10px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-200">
            {{ role }}
          </span>

          <span class="flex items-center gap-1 text-[11px] text-slate-400">
            <span class="w-2 h-2 bg-green-400 rounded-full"></span>
            Active
          </span>
        </div>

      </div>

      <!-- BODY -->
      <div class="p-4 space-y-4">

        <!-- STATS -->
        <div class="grid grid-cols-4 gap-2">

          <div class="bg-gray-50 border rounded-lg p-2 text-center">
            <div class="text-lg font-semibold text-gray-900">
              {{ user.age }} <span class="text-xs text-gray-400">yr</span>
            </div>
            <div class="text-[11px] text-gray-400">Age</div>
          </div>

          <div class="bg-gray-50 border rounded-lg p-2 text-center">
            <div class="text-lg font-semibold text-gray-900">
              {{ Math.round(user.height) }} <span class="text-xs text-gray-400">cm</span>
            </div>
            <div class="text-[11px] text-gray-400">Height</div>
          </div>

          <div class="bg-gray-50 border rounded-lg p-2 text-center">
            <div class="text-lg font-semibold text-gray-900">
              {{ Math.round(user.weight) }} <span class="text-xs text-gray-400">kg</span>
            </div>
            <div class="text-[11px] text-gray-400">Weight</div>
          </div>

          <div class="bg-gray-50 border rounded-lg p-2 text-center">
            <div class="text-base font-semibold text-gray-900">
              {{ user.bloodGroup }}
            </div>
            <div class="text-[11px] text-gray-400">Blood</div>
          </div>

        </div>

        <!-- GRID (DETAILS) -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 border rounded-xl overflow-hidden">

          <div
            v-for="item in gridItems"
            :key="item.label"
            class="p-3 border-r border-b last:border-r-0"
          >
            <div class="text-[10px] uppercase tracking-wide text-gray-400">
              {{ item.label }}
            </div>

            <div class="text-sm text-gray-800 font-medium mt-1 break-words">
              {{ item.value }}
            </div>
          </div>

        </div>

        <!-- FOOTER -->
        <div class="grid grid-cols-3 gap-3">

          <div class="bg-gray-50 border rounded-lg p-3">
            <div class="text-[10px] text-gray-400 uppercase">Status</div>
            <div class="flex items-center gap-2 text-sm font-medium">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Active
            </div>
          </div>

          <div class="bg-gray-50 border rounded-lg p-3">
            <div class="text-[10px] text-gray-400 uppercase">Account</div>
            <div class="text-sm font-medium">{{ role }}</div>
          </div>

          <div class="bg-gray-50 border rounded-lg p-3">
            <div class="text-[10px] text-gray-400 uppercase">Last Login</div>
            <div class="text-sm font-medium">Today</div>
          </div>

        </div>

      </div>
    </div>

    <!-- LOADING -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      <p class="mt-3 text-gray-500">{{ error || 'Loading…' }}</p>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserProfile } from "../composables/useUserProfile";

const { user, error, initials, role, subtitle, hair } = useUserProfile();

/* GRID DATA */
const gridItems = computed(() => [
  { label: "Email", value: user.value?.email },
  { label: "Phone", value: user.value?.phone },
  { label: "Username", value: user.value?.username },
  { label: "Gender", value: user.value?.gender },
  { label: "Birth Date", value: user.value?.birthDate },
  { label: "Eye Color", value: user.value?.eyeColor },
  { label: "Hair", value: hair.value },
  { label: "City", value: user.value?.address?.city },
  { label: "Country", value: user.value?.address?.country },
  { label: "Company", value: user.value?.company?.name },
  { label: "Department", value: user.value?.company?.department },
  { label: "Address", value: user.value?.address?.address },
]);
</script>