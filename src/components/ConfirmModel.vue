<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">

    <!-- BACKDROP -->
    <div
      class="absolute inset-0 bg-black/60"
      @click="$emit('close')"
    ></div>

    <!-- MODAL BOX -->
    <div class="relative bg-white w-full max-w-sm sm:max-w-md rounded-xl shadow-xl p-6 z-10">
      
      <h2 class="text-lg font-semibold text-gray-800">
        {{ title }}
      </h2>

      <p class="text-gray-600 mt-2">
        {{ message }}
      </p>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-400"
        >
          Cancel
        </button>

        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400"
        >
          Confirm
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
  isOpen: {
    type: Boolean,
    required: true
  },
    title: { type: String, default: "Are you sure?" },
    message: { type: String, default: "This action cannot be undone." }
  },
  emits: ["close", "confirm"],
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    }
  },
  watch: {
  isOpen(val) {
    console.log("ConfirmModel isOpen:", val);
  }
}
};

</script>