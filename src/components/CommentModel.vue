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
import Swal from "sweetalert2"

const props = defineProps({
  show: Boolean,
  task: Object
})

const emit = defineEmits(["close"])

const comment = ref("")
const loading = ref(false)

const submitComment = async () => {
  if (!comment.value.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Empty Comment",
      text: "Please write a comment first"
    })
    return
  }

  loading.value = true

  try {
    await addTaskComment(props.task.id, comment.value)

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Comment added successfully",
      timer: 1500,
      showConfirmButton: false
    })

    comment.value = ""

    emit("close")

  } catch (err) {
    console.log(err)

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to add comment"
    })

  } finally {
    loading.value = false
  }
}

</script>