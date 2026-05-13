<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content modal-box">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>   

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
   overflow: hidden;
}

.modal-box {
  background: white;
  border-radius: 12px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 10px;
  width: 700px;
}
</style>