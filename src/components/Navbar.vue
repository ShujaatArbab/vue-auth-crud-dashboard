<template>
  <div class="h-14 bg-gray-900 text-white flex justify-between items-center px-4 sm:px-5">

    <!-- Left: Title -->
    <h1 class="font-bold text-base sm:text-lg">Admin Panel</h1>

    <!-- Right: actions -->
    <div class="flex gap-3 items-center">

      <!-- ✅ Hamburger — only visible on mobile (hidden on md+) -->
      <button
        class="md:hidden p-1.5 rounded hover:bg-gray-700 transition"
        @click="$emit('toggle-sidebar')"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

    </div>

  </div>
</template>

<script>
export default {
  emits: ["toggle-sidebar"]
};
</script>