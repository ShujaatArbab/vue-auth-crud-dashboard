<template>
  <div
    class="h-14 flex justify-between items-center px-4 sm:px-5 text-white shadow-md relative"
    style="background: linear-gradient(150deg, #14532d 0%, #166534 50%, #15803d 100%)"
  >
    <!-- LEFT -->
    <h1 class="font-bold text-base sm:text-lg tracking-wide">
      Admin Panel
    </h1>

    <!-- RIGHT -->
    <div class="flex gap-3 items-center relative notification-wrapper">

      <!-- NOTIFICATION BELL -->
      <button
        v-if="isAdmin"
        class="relative p-2 rounded hover:bg-white/10"
        @click="openNotifications"
      >
        <!-- Bell Icon -->
        <svg
        
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        <!-- BADGE -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full"
        >
          {{ unreadCount }}
        </span>
      </button>

      <!-- DROPDOWN -->
      <div
        v-if="showDropdown && isAdmin"
        class="absolute right-0 top-12 w-80 bg-white text-black shadow-lg rounded-lg z-50"
      >
        <!-- HEADER -->
        <div class="p-2 font-bold border-b">
          Notifications
        </div>

        <!-- EMPTY STATE -->
        <div
          v-if="notifications.length === 0"
          class="p-3 text-sm text-gray-500"
        >
          No new comments
        </div>

        <!-- LIST -->
        <div
          v-for="item in notifications"
          :key="item.id"
          class="p-2 border-b hover:bg-gray-100"

        >
        
        
          <p class="text-sm font-semibold">
            <b>Username : </b>{{ item.user_name }}
          </p>
         
          <p class="text-sm text-gray-700">
            <b>Comment : </b>{{item.comment }}
          </p>

          <p class="text-xs text-gray-400">
            {{ item.task?.title }}
          </p>
        </div>
      </div>

      <!-- MOBILE MENU -->
      <button
        class="md:hidden p-2 rounded hover:bg-white/10"
        @click="$emit('toggle-sidebar')"
      >
        ☰
      </button>
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
      isAdmin,
    };
  },
};
</script>