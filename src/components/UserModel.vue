<template>
  <!-- OVERLAY -->
  <div
    class="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center overflow-hidden"
    @click.self="$emit('close')"
  >
    <!-- MODAL BOX -->
    <div
      class="bg-white rounded-xl max-h-[90vh] overflow-y-auto p-3 w-[700px] shadow-lg"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>