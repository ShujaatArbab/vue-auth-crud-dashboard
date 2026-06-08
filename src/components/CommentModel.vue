<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center">

    <div class="bg-white p-6 rounded-lg w-96">

      <h2>Add Comment</h2>

      <p class="text-sm mt-2">
        Task: {{ task?.title }}
      </p>

      <textarea
        v-model="comment"
        rows="4"
        class="w-full border rounded mt-3 p-2"
        placeholder="Write comment..."
      />

      <div class="flex justify-center gap-3 mt-3">

        <button
          @click="submitComment"
          class="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

        <button
          class="bg-red-600 text-white px-4 py-2 rounded"
          @click="emit('close')"
        >
          Close
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref,watch } from "vue"
import { addTaskComment } from "../services/userApi"
import { useToast } from "../composables/useToast"

const props = defineProps({
  show: Boolean,
  task: Object
})
const { triggerToast } = useToast()


const emit = defineEmits(["close"])

const comment = ref("")
const loading = ref(false)

const submitComment = async () => {
  if (!comment.value.trim()) {
    triggerToast("Please write a comment", "error")
    return
  }

  loading.value = true

  try {
    await addTaskComment(props.task.id, comment.value)

    comment.value = ""

    triggerToast("Comment added successfully", "success")

    emit("close")

  } catch (err) {
    console.log(err)

    triggerToast("Failed to add comment", "error")

  } finally {
    loading.value = false
  }
}
</script>