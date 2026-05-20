<template>
  <!-- OVERLAY -->
  <div
    class="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <!-- MODAL -->
    <div
      class="w-full max-w-3xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >

      <!-- HEADER -->
      <div class="flex justify-between items-center px-5 py-3 border-b bg-white">
        <div class="flex items-center gap-2 font-semibold text-gray-800">
          <i class="ti ti-user text-green-600"></i>
          <span>User Details</span>
        </div>

        <button
          class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600"
          @click="$emit('close')"
        >
          <i class="ti ti-x text-sm"></i>
        </button>
      </div>

      <!-- BODY -->
      <div class="flex-1 overflow-y-auto p-4 space-y-6">

        <!-- USER TOP -->
        <div class="flex items-center gap-4">
          <img
            v-if="user.image"
            :src="user.image"
            class="w-14 h-14 rounded-full object-cover border"
          />

          <div
            v-else
            class="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border"
          >
            {{ initials }}
          </div>

          <div >
            <h3 class="text-base font-semibold text-gray-900">
             {{ user.first_name || user.firstName }} 
              {{ user.last_name || user.lastName }}
            </h3>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>

        <div class="border-t"></div>

        <!-- SECTIONS -->
        <div
        
          v-for="section in sections"
          :key="section.title"
          class="space-y-3 "
        >

          <h4 class="text-xs font-bold uppercase tracking-wider text-green-700">
            {{ section.title }}
          </h4>

          <!-- 🔥 4 COLUMN GRID -->
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            <div
              v-for="item in section.items"
              :key="item.label"
              class="bg-gray-50 border border-gray-100 rounded-lg p-3 hover:shadow-sm transition"
            >
              <div class="text-[11px] text-gray-500 uppercase tracking-wide">
                {{ item.label }}
              </div>

              <div class="mt-1 text-sm font-medium text-gray-900 break-words">
                {{ item.value }}
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- FOOTER -->
      <div class="px-5 py-3 border-t bg-gray-50 flex justify-end">
        <button
          class="px-4 py-2 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-2"
          @click="$emit('close')"
        >
          <i class="ti ti-x"></i>
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  user: { type: Object, required: true },
});

defineEmits(["close"]);

/* SAFE NORMALIZER (IMPORTANT FIX) */
const userData = computed(() => {
  const u = props.user || {};

  return {
    username: u.username ?? "—",
    firstName: u.first_name ?? u.firstName ?? "—",
    lastName: u.last_name ?? u.lastName ?? "—",
    email: u.email ?? "—",
    phone: u.phone ?? "—",
    country: u.country ?? "—",
    city: u.city ?? "—",
    dob: u.dob ?? "—",
    gender: u.gender ?? "—",
  };
});

const initials = computed(() => {
  const f = userData.value.first_name?.[0] || "";
  const l = userData.value.last_name?.[0] || "";
  return (f + l).toUpperCase();
});

/* CLEAN SECTIONS (NO EXTRA API FIELDS LIKE hair/address/etc) */
const sections = computed(() => [
  {
    title: "User Information",
    items: [
      { label: "Username", value: userData.value.username },
      { label: "First Name", value: userData.value.firstName },
      { label: "Last Name", value: userData.value.lastName },
      { label: "Email", value: userData.value.email },
      { label: "Phone", value: userData.value.phone },
      { label: "Gender", value: userData.value.gender },
      { label: "DOB", value: userData.value.dob },
    ],
  },
  {
    title: "Location",
    items: [
      { label: "Country", value: userData.value.country },
      { label: "City", value: userData.value.city },
    ],
  },
]);
</script>