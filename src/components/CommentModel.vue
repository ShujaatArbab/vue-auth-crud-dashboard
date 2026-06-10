  <template>
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <i class="fa-solid fa-square-check text-green-700 text-sm"></i>
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-900">{{ task?.title }}</h2>
              <p class="text-xs text-gray-400 mt-0.5">Task Details & Comments</p>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-xs"
          >✕</button>
        </div>

        <!-- BODY -->
        <div class="flex-1 overflow-y-auto">

          <!-- TASK INFO -->
          <div class="px-6 pt-5 pb-4 border-b border-gray-100">

            <div class="mb-4">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</p>
              <p class="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                {{ task?.description || "No description provided." }}
              </p>
            </div>

            <div class="grid grid-cols-3 gap-3">

              <div class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned To</p>
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ task?.assigned_to_name?.[0]?.toUpperCase() || '?' }}
                  </div>
                  <span class="text-xs font-medium text-gray-700 truncate">{{ task?.assigned_to_name || "Unassigned" }}</span>
                </div>
              </div>

              <div class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
                <span
                  class="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700': task?.status === 'pending',
                    'bg-blue-100 text-blue-700':    task?.status === 'in_progress',
                    'bg-green-100 text-green-700':  task?.status === 'completed'
                  }"
                >{{ task?.status || '—' }}</span>
              </div>

              <div class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Comments</p>
                <p class="text-xs font-bold text-indigo-600">{{ comments?.length || 0 }} total</p>
              </div>

            </div>
          </div>

          <!-- ✅ 2 COLUMN COMMENTS -->
          <div class="px-6 py-4 border-b border-gray-100">

            <div class="flex items-center gap-2 mb-4">
              <i class="fa-solid fa-comments text-gray-400 text-sm"></i>
              <h3 class="text-sm font-bold text-gray-800">Comments</h3>
              <span v-if="comments?.length || 0" class="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ comments?.length || 0 }} total</span>
            </div>

            <div class="grid grid-cols-2 gap-4">

              <!-- USER COMMENTS -->
              <div>
                <div class="flex items-center gap-1.5 mb-3">
                  <div class="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <i class="fa-solid fa-user text-indigo-600 text-[9px]"></i>
                  </div>
                  <span class="text-xs font-bold text-indigo-600 uppercase tracking-wide">User Comments</span>
                  <span class="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full font-semibold">{{ userComments?.length||0 }}</span>
                </div>

                <div v-if="userComments?.length||0" class="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  <div v-for="c in userComments" :key="c.id" class="flex items-start gap-2">
                    <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {{ c.user_name?.[0]?.toUpperCase() || '?' }}
                    </div>
                    <div>
                      <div class="bg-indigo-50 border border-indigo-100 rounded-2xl rounded-tl-sm px-3 py-2">
                        <span class="block text-[10px] font-bold text-indigo-600 mb-0.5">{{ c.user_name }}</span>
                        <p class="text-xs text-gray-700 leading-relaxed">{{ c.comment }}</p>
                      </div>
                      <span class="text-[9px] text-gray-400 ml-2">{{ c.created_at ? new Date(c.created_at).toLocaleString() : '' }}</span>
                    </div>
                  </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <i class="fa-regular fa-comment text-xl text-gray-300 mb-1"></i>
                  <p class="text-xs text-gray-400">No user comments</p>
                </div>
              </div>

              <!-- ADMIN COMMENTS -->
              <div>
                <div class="flex items-center gap-1.5 mb-3">
                  <div class="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <i class="fa-solid fa-shield-halved text-red-500 text-[9px]"></i>
                  </div>
                  <span class="text-xs font-bold text-red-500 uppercase tracking-wide">Admin Comments</span>
                  <span class="text-[10px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{{ adminComments?.length||0 }}</span>
                </div>

                <div v-if="adminComments?.length||0" class="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  <div v-for="c in adminComments" :key="c.id" class="flex items-start gap-2">
                    <div class="w-6 h-6 rounded-full bg-red-100 text-red-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">A</div>
                    <div>
                      <div class="bg-red-50 border border-red-100 rounded-2xl rounded-tl-sm px-3 py-2">
                        <span class="block text-[10px] font-bold text-red-500 mb-0.5">Admin</span>
                        <p class="text-xs text-gray-700 leading-relaxed">{{ c.comment }}</p>
                      </div>
                      <span class="text-[9px] text-gray-400 ml-2">{{ c.created_at ? new Date(c.created_at).toLocaleString() : '' }}</span>
                    </div>
                  </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <i class="fa-regular fa-comment text-xl text-gray-300 mb-1"></i>
                  <p class="text-xs text-gray-400">No admin comments</p>
                </div>
              </div>

            </div>
          </div>

          <!-- ADD COMMENT -->
          <div class="px-6 py-4">
            <div class="flex items-center gap-2 mb-3">
              <i class="fa-solid fa-pen text-gray-400 text-sm"></i>
              <h3 class="text-sm font-bold text-gray-800">Add Comment</h3>
            </div>
            <textarea
              v-model="comment"
              rows="3"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-gray-50 resize-none placeholder-gray-400 transition-all"
              placeholder="Write your comment here..."
            />
          </div>

        </div>

        <!-- FOOTER -->
        <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
          >Cancel</button>
          <button
            @click="submitComment"
            :disabled="loading"
            class="px-5 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50 transition-all"
          >
            <i v-if="!loading" class="fa-solid fa-paper-plane mr-1.5 text-xs"></i>
            {{ loading ? "Submitting..." : "Submit" }}
          </button>
        </div>

      </div>
    </div>
  </template>

  <script setup>
import { ref, computed, watch } from "vue"
import { addTaskComment } from "../services/userApi"
import { useToast } from "../composables/useToast"

const props = defineProps({
  show: Boolean,
  task: Object,
  taskComments: Object
})

const emit = defineEmits(["close"])

const comment = ref("")
const loading = ref(false)


// SAFE NORMALIZED COMMENTS
const comments = computed(() => {
  const id = String(props.task?.id)
  const raw = props.taskComments

  if (!raw || !props.task?.id) return []

  if (Array.isArray(raw)) return raw

  if (raw[id] && Array.isArray(raw[id])) return raw[id]

  if (raw.data && Array.isArray(raw.data)) return raw.data

  return []
})


//  ADMIN DETECTION (correct + safe)
const isAdminComment = (c) =>
  c?.is_admin === true ||
  c?.is_admin === 1 ||
  c?.role?.toLowerCase?.() === "admin"


//  SPLIT COMMENTS SAFELY
const userComments = computed(() =>
  (comments.value || []).filter(c => !isAdminComment(c))
)

const adminComments = computed(() =>
  (comments.value || []).filter(c => isAdminComment(c))
)

const { triggerToast } = useToast()


//  SUBMIT COMMENT
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


//  DEBUG WATCH (safe)
watch(
  () => props.taskComments,
  (v) => {
    const id = String(props.task?.id)

    console.log("TASK ID:", id)
    console.log("COMMENTS FOR TASK:", v?.[id])

    v?.[id]?.forEach((c) => {
      console.log({
        comment: c.comment,
        role: c.role,
        is_admin: c.is_admin,
        user_name: c.user_name
      })
    })
  },
  { immediate: true, deep: true }
)
</script>