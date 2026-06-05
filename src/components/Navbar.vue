<template>
  <div
    class="h-14 flex justify-between items-center px-4 sm:px-5 text-white shadow-md relative"
    style="background: linear-gradient(150deg, #14532d 0%, #166534 50%, #15803d 100%)"
  >
    <!-- LEFT -->
    <h1 class="font-bold text-base sm:text-lg tracking-wide">Admin Panel</h1>

    <!-- RIGHT -->
    <div class="flex gap-3 items-center relative notification-wrapper">

      <!-- NOTIFICATION BELL -->
      <button
        v-if="isAdmin"
        class="relative p-2 rounded-lg hover:bg-white/10 transition-all"
        @click="openNotifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        <!-- BADGE -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-green-700"
        >
          {{ unreadCount }}
        </span>

        <!--  STATUS NEW INDICATOR (ADDED) -->
        <span
  v-if="statusCount > 0"
  class="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1 rounded-full"
>
  {{ statusCount }}
</span>
      </button>

      <!-- NOTIFICATION DROPDOWN -->
      <div
        v-if="showDropdown && isAdmin"
        class="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100"
      >

        <!-- HEADER -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-green-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="text-sm font-semibold text-gray-800">Notifications</span>
          </div>

          <span
            v-if="notifications.length"
            class="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
          >
            {{ notifications.length }} new
          </span>
        </div>

        <!-- EMPTY STATE -->
        <div
          v-if="notifications.length === 0"
          class="flex flex-col items-center justify-center py-8 text-gray-400 gap-2"
        >
          <p class="text-sm">No new notifications</p>
        </div>

        <!-- LIST -->
        <div class="max-h-72 overflow-y-auto divide-y divide-gray-50">
          <div
            v-for="item in notifications"
            :key="item.id"
            class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-all cursor-pointer"
          >

            <div
              class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
            >
              {{ item.user_name?.[0]?.toUpperCase() || '?' }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <span class="text-xs font-semibold text-gray-800 truncate">
                  {{ item.user_name }}
                </span>
                <span class="text-[10px] text-gray-400">just now</span>
              </div>

              <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {{  item.message }}
              </p>

              <div class="flex items-center gap-1 mt-1">
                <span class="text-[10px] text-gray-400 truncate">
                  {{ item.task?.title || 'Task' }}
                </span>
              </div>
            </div>

            <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5"></div>

          </div>
        </div>

        <div
          v-if="notifications.length"
          class="px-4 py-2.5 border-t border-gray-100 bg-gray-50"
        >
          <p class="text-xs text-center text-gray-400">All caught up ✓</p>
        </div>

      </div>

      <!-- MOBILE -->
      <button
        class="md:hidden p-2 rounded hover:bg-white/10"
        @click="$emit('toggle-sidebar')"
      >☰</button>

    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import useNavbar from "../composables/useNavbar";
import { useAuthenticationStore } from "../store/Auth";

export default {
  emits: ["toggle-sidebar"],
  setup() {
    const navbar = useNavbar();
    const authStore = useAuthenticationStore();
    const isAdmin = computed(() => authStore.user?.role === "admin");

    return {
      ...navbar,
      isAdmin
    };
  },
};
</script>