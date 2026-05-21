<template>
  <div class="min-h-screen w-full bg-gray-50 p-3">

    <!-- CARD -->
    <div
      v-if="user"
      class="w-full bg-white rounded-2xl border shadow-sm overflow-hidden"
    >

      <!-- HERO -->
      <div class="bg-green-800 px-6 pt-5 pb-5 flex items-end gap-4">

        <!-- AVATAR -->
        <div
          class="w-16 h-16 rounded-full bg-red-600 border-2 border-white/10 flex items-center justify-center text-white font-semibold text-lg"
        >
          {{ initials }}
        </div>

        <!-- NAME -->
        <div class="flex-1">
          <div class="text-white font-semibold text-lg">
            {{ user.first_name }} {{ user.last_name }}
          </div>

          <div class="text-xs text-slate-400">
            {{ subtitle }}
          </div>
        </div>

        <!-- ROLE -->
        <div>
          <span
            class="text-[10px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-200"
          >
            {{ role }}
          </span>
        </div>

      </div>

      <!-- BODY -->
      <div class="p-4">

        <!-- DETAILS GRID -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border rounded-xl overflow-hidden"
        >

          <div
            v-for="item in gridItems"
            :key="item.label"
            class="p-3 border-r border-b"
          >

            <div class="text-[10px] uppercase tracking-wide text-gray-400">
              {{ item.label }}
            </div>

            <div class="text-sm text-gray-800 font-medium mt-1 break-words">
              {{ item.value || "—" }}
            </div>

          </div>

        </div>

        <!-- FOOTER -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">

          <div class="bg-gray-50 border rounded-lg p-3">
            <div class="text-[10px] text-gray-400 uppercase">
              Status
            </div>

            <div class="flex items-center gap-2 text-sm font-medium">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Active
            </div>
          </div>

          <div class="bg-gray-50 border rounded-lg p-3">
            <div class="text-[10px] text-gray-400 uppercase">
              Account
            </div>

            <div class="text-sm font-medium">
              {{ role }}
            </div>
          </div>

          <div class="bg-gray-50 border rounded-lg p-3">
            <div class="text-[10px] text-gray-400 uppercase">
              Last Login
            </div>

            <div class="text-sm font-medium">
              Today
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- LOADING -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-20"
    >
      <div
        class="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"
      ></div>

      <p class="mt-3 text-gray-500">
        {{ error || "Loading…" }}
      </p>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserProfile } from "../composables/useUserProfile";

const {
  user,
  error,
  initials,
  role,
  subtitle
} = useUserProfile();

const gridItems = computed(() => [
  { label: "Email", value: user.value?.email },
  { label: "Phone", value: user.value?.phone },
  { label: "Username", value: user.value?.username },
  { label: "Gender", value: user.value?.gender },
  { label: "Birth Date", value: user.value?.dob },
  { label: "City", value: user.value?.city },
  { label: "Country", value: user.value?.country },
  { label: "Date Joined", value: user.value?.date_joined },
]);
</script>