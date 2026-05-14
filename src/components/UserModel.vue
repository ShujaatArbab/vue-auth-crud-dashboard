<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center"
      @click.self="$emit('close')"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script>
export default {
  emits: ["close"]
};
</script>