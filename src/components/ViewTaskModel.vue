<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      @click.stop
    >
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
            <i class="fa-solid fa-square-check text-green-700 text-sm"></i>
          </div>
          <div>
            <span class="text-sm font-semibold text-gray-800">Task Details</span>
            <p class="text-xs text-gray-400">View task info and comments</p>
          </div>
        </div>
        <button
          class="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-xs"
          @click="$emit('close')"
        >✕</button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-100 bg-white">
          <div class="grid grid-cols-3 gap-4 p-3 bg-gray-50 border border-gray-100 rounded-xl mb-4">
            <div>
              <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Title</span>
              <span class="text-xs font-normal text-gray-700 truncate block max-w-full">
                {{ task?.title || '—' }}
              </span>
            </div>

            <div>
              <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</span>
              <span
                class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': task?.status === 'pending',
                  'bg-blue-100 text-blue-700': task?.status === 'in_progress',
                  'bg-green-100 text-green-700': task?.status === 'completed',
                }"
              >
                {{ task?.status?.replace('_', ' ') || '—' }}
              </span>
            </div>

            <div>
              <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned To</span>
              <span class="text-xs font-normal text-gray-700 block truncate">
                {{ task?.assigned_to || 'Unassigned' }}
              </span>
            </div>
          </div>

          <div>
            <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</span>
            <p class="text-xs font-normal text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              {{ task?.description || 'No description provided.' }}
            </p>
          </div>
        </div>

        <div class="px-6 py-4 space-y-6">
          <div class="flex items-center gap-2 pb-1 border-b border-gray-50">
            <i class="fa-solid fa-comments text-gray-400 text-sm"></i>
            <h3 class="text-sm font-bold text-gray-800">Comments Feed</h3>
            <span class="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {{ sortedComments.length }} total
            </span>
          </div>

          <div v-if="sortedComments.length" class="space-y-3">
            <div 
              v-for="c in sortedComments" 
              :key="c.id || c.created_at" 
              class="w-full flex"
              :class="isAdminComment(c) ? 'justify-start' : 'justify-end'"
            >
              <div 
                v-if="isAdminComment(c)"
                class="max-w-[75%] bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3"
              >
                <div class="w-6 h-6 rounded-full bg-red-200 text-red-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  A
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-4 mb-1">
                    <span class="text-xs font-bold text-red-600">Admin</span>
                    <span class="text-[9px] text-gray-400 whitespace-nowrap">
                      {{ formatCommentTime(c.created_at) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-700 leading-relaxed break-words">{{ c.comment }}</p>
                </div>
              </div>

              <div 
                v-else
                class="max-w-[75%] bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-3"
              >
                <div class="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {{ c.user_name?.[0]?.toUpperCase() || 'U' }}
                </div>
                <div class="flex-1 min-w-0 text-left">
                  <div class="flex items-center justify-between gap-4 mb-1">
                    <span class="text-xs font-bold text-indigo-600 truncate max-w-[120px] block">
                      {{ c.user_name || 'User' }}
                    </span>
                    <span class="text-[9px] text-gray-400 whitespace-nowrap">
                      {{ formatCommentTime(c.created_at) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-700 leading-relaxed break-words">{{ c.comment }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <i class="fa-regular fa-comment text-xl text-gray-300 mb-1"></i>
            <p class="text-xs text-gray-400">No comments on this task yet</p>
          </div>
        </div>

        <div class="px-6 pb-4 border-t border-gray-100 pt-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fa-solid fa-pen text-gray-400 text-xs"></i>
            <h3 class="text-sm font-bold text-gray-800">Add Comment</h3>
          </div>
          <textarea
            v-model="comment"
            rows="3"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 resize-none placeholder-gray-400 transition-all"
            placeholder="Write your comment here..."
          />
          <div class="flex justify-end mt-2">
            <button
              class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
              @click="submitComment"
            >
              <i class="fa-solid fa-paper-plane text-[10px]"></i>
              Add Comment
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end px-6 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
        <button
          class="px-5 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition"
          @click="$emit('close')"
        >Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useToast } from "../composables/useToast";

const { triggerToast } = useToast();

const props = defineProps({
  show: Boolean,
  task: Object,
  taskComments: [Object, Array], // Optimized to accept both variations cleanly
});

const emit = defineEmits(["close", "submitComment"]);
const comment = ref("");

// Helper to determine message alignment
const isAdminComment = (c) =>
  c.is_admin === true ||
  c.is_admin === 1 ||
  (c.role && String(c.role).toLowerCase() === "admin");

// 1. Unified Reactive Data Extraction
const comments = ref([]);

const extractComments = () => {
  if (!props.task?.id || !props.taskComments) {
    comments.value = [];
    return;
  }
  
  const raw = props.taskComments;
  const id = String(props.task.id);

  if (Array.isArray(raw)) {
    comments.value = raw;
  } else if (raw.data && Array.isArray(raw.data)) {
    comments.value = raw.data;
  } else if (raw[id] && Array.isArray(raw[id])) {
    comments.value = raw[id];
  } else {
    comments.value = [];
  }
};

// 2. Watchers to listen for both initial loading AND real-time WebSocket updates
watch(
  () => props.taskComments,
  () => {
    extractComments();
  },
  { deep: true, immediate: true }
);

watch(
  () => props.task?.id,
  () => {
    extractComments();
  },
  { immediate: true }
);

// 3. Chronological UI Sorting Engine
const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime() || parseTimeString(a.created_at);
    const timeB = new Date(b.created_at).getTime() || parseTimeString(b.created_at);
    return timeA - timeB;
  });
});

// Fallback string time parser (e.g., "11:07") if standard ISO stamps miss formatting
function parseTimeString(timeStr) {
  if (!timeStr) return 0;
  const match = String(timeStr).match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const d = new Date();
  d.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
  return d.getTime();
}

// Clean UI time window formatting wrapper
const formatCommentTime = (dateStr) => {
  if (!dateStr) return "";
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return dateStr;
};

const submitComment = () => {
  const text = comment.value?.trim();
  if (!text) {
    triggerToast("Please write a comment", "error");
    return;
  }
  emit("submitComment", text);
  comment.value = "";
};
</script>