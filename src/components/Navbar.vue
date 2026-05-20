<template>
  <div class="h-14 flex justify-between items-center px-4 sm:px-5 text-white shadow-md"
       style="background: linear-gradient(150deg, #14532d 0%, #166534 50%, #15803d 100%)">

    <!-- LEFT -->
    <h1 class="font-bold text-base sm:text-lg tracking-wide">
      Admin Panel
    </h1>

    <!-- RIGHT -->
    <div class="flex gap-3 items-center">

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
export default {
  emits: ["toggle-sidebar"]
};
</script>