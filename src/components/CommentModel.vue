<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
    >

      <!-- HEADER -->
      <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800">
            Task Details
          </h2>
          <p class="text-sm text-gray-500">
            View task information and add comments
          </p>
        </div>

        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-red-500 text-xl"
        >
          ✕
        </button>
      </div>

      <!-- BODY -->
      <div class="flex-1 overflow-y-auto p-6">

        <!-- TASK DETAILS -->
        <div class="bg-gray-50 border rounded-xl p-5">

          <div>
  <p class="text-xs font-semibold uppercase tracking-wide  text-gray-800 mb-1">
    Title :
  </p>

  <h3 class="  text-gray-400">
    {{ task?.title }}
  </h3>
</div>

<div class="mt-4">
  <p class="text-xs font-semibold uppercase tracking-wide  text-gray-800 mb-1">
    Description :
  </p>

  <p class="text-gray-400 ">
    {{ task?.description || "No description available" }}
  </p>
</div>

          <div class="grid grid-cols-2 gap-4 mt-5">

            <div>
              <p class="text-xs font-semibold uppercase tracking-wide  text-gray-800 mb-1">
                Assigned To
              </p>

              <p class=" text-gray-400">
                {{ task?.assigned_to_name || "N/A" }}
              </p>
            </div>

            <div>
              <p class="text-xs font-semibold uppercase tracking-wide  text-gray-800 mb-1">
                Status
              </p>

              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1"
                :class="{
                  'bg-yellow-100 text-yellow-700': task?.status === 'pending',
                  'bg-blue-100 text-blue-700': task?.status === 'in_progress',
                  'bg-green-100 text-green-700': task?.status === 'completed'
                }"
              >
                {{ task?.status }}
              </span>
            </div>

          </div>

        </div>

        <!-- COMMENTS -->
        <div class="mt-6">

          <h3 class="font-semibold text-gray-800 mb-3">
            Previous Comments
          </h3>

          <div
            v-if="comments.length"
            class="space-y-3 max-h-72 overflow-y-auto"
          >

            <div
              v-for="c in comments"
              :key="c.id"
              class="bg-gray-50 border rounded-xl p-4"
            >

              <div class="flex justify-between items-center">

                <span class="font-medium text-indigo-600">
                  {{ c.user_name }}
                </span>

                <span class="text-xs text-gray-400">
                  {{ new Date(c.created_at).toLocaleString() }}
                </span>

              </div>

              <p class="mt-2 text-sm text-gray-700">
                {{ c.comment }}
              </p>

            </div>

          </div>

          <div
            v-else
            class="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border"
          >
            No comments yet
          </div>

        </div>

        <!-- ADD COMMENT -->
        <div class="mt-6">

          <h3 class="font-semibold text-gray-800 mb-3">
            Add New Comment
          </h3>

          <textarea
            v-model="comment"
            rows="4"
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
            placeholder="Write your comment..."
          />

        </div>

      </div>

      <!-- FOOTER -->
      <div class="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">

        <button
          @click="emit('close')"
          class="px-5 py-2 rounded-lg border text-white border-gray-300 bg-red-500 hover:bg-red-700"
        >
          Cancel
        </button>

        <button
          @click="submitComment"
          :disabled="loading"
          class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          {{ loading ? "Submitting..." : "Submit Comment" }}
        </button>

      </div>

    </div>
  </div>
</template>
<script setup>
import { ref,computed } from "vue"
import { addTaskComment } from "../services/userApi"
import { useToast } from "../composables/useToast"
const props = defineProps({
  show: Boolean,
  task: Object,
  taskComments: Object
})
const comments = computed(() => {
  if (!props.task?.id) return []

  return props.taskComments?.[props.task.id] || []
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