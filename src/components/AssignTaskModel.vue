<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    @click="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >

      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0"/>
            </svg>
          </div>
          <span class="text-sm font-semibold text-gray-800">Re-Assign Task</span>
        </div>

        <button
          class="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-xs"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- SUB HEADER -->
      <div class="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <p class="text-xs text-gray-500">
          Select a user to re-assign this task to
        </p>
      </div>

      <!-- TABLE HEADER -->
      <div class="grid grid-cols-12 px-6 py-2 bg-gray-100 border-b border-gray-200">
        <span class="col-span-1 text-xs font-bold text-gray-500 uppercase tracking-wide">#</span>
        <span class="col-span-5 text-xs font-bold text-gray-500 uppercase tracking-wide">Username</span>
        <span class="col-span-5 text-xs font-bold text-gray-500 uppercase tracking-wide">Email</span>
        <span class="col-span-1"></span>
      </div>

      <!-- USER LIST -->
      <div class="divide-y divide-gray-100 max-h-72 overflow-y-auto">

        <div
          v-for="(user, index) in users"
          :key="user.id"
          class="grid grid-cols-12 items-center px-6 py-3 hover:bg-green-50 cursor-pointer transition-all group"
          @click="$emit('selectUser', user.id)"
        >

          <!-- INDEX -->
          <span class="col-span-1 text-xs text-gray-400">
            {{ index + 1 }}
          </span>

          <!-- USERNAME -->
          <div class="col-span-5 flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0"
            >
              {{ user.username?.[0]?.toUpperCase() || "?" }}
            </div>
            <span class="text-sm font-medium text-gray-800 truncate">
              {{ user.username }}
            </span>
          </div>

          <!-- EMAIL -->
          <div class="col-span-5">
            <span class="text-xs text-gray-500 truncate block">
              {{ user.email }}
            </span>
          </div>

          <!-- ARROW -->
          <div class="col-span-1 flex justify-end">
            <svg
              class="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-all"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5l7 7-7 7"/>
            </svg>
          </div>

        </div>

        <!-- EMPTY STATE -->
        <div
          v-if="!users?.length"
          class="flex flex-col items-center justify-center py-10 text-gray-400"
        >
          <svg class="w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm">No users available</p>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button
          class="px-5 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  users: Array,
});

defineEmits(["close", "selectUser"]);
</script>