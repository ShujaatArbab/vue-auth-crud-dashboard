<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-[420px] p-6 rounded-xl">
      <h3 class="text-lg font-semibold mb-4">Create Task</h3>

      <input
        v-model="title"
        placeholder="Title"
        class="w-full border p-2 mb-3 rounded"
      />

      <textarea
        v-model="description"
        placeholder="Description"
        class="w-full border p-2 mb-4 rounded"
      />

      <div class="flex justify-end gap-2">
        <button
          @click="$emit('close')"
          class="px-3 py-1 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          @click="submitTask"
          class="px-3 py-1 bg-green-600 text-white rounded"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const title = ref("");
const description = ref("");

const submitTask = () => {
  if (!title.value.trim()) {
    Swal.fire({
      title: "Validation Error",
      text: "Title is required",
      icon: "warning",
    });
    return;
  }

  emit("submit", {
    title: title.value,
    description: description.value,
  });
};

// Clear form when modal closes
watch(
  () => props.show,
  (value) => {
    if (!value) {
      title.value = "";
      description.value = "";
    }
  }
);
</script>