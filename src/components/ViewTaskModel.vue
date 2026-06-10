<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    @click="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      @click.stop
    >

      <!-- HEADER -->
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

      <!-- BODY -->
      <div class="flex-1 overflow-y-auto">

        <!-- TASK INFO — horizontal rows -->
        <div class="px-6 py-2 divide-y divide-gray-100">
          <div class="flex items-start py-2.5 gap-4">
            <span class="w-24 text-xs font-bold uppercase tracking-wide text-gray-500 pt-0.5 shrink-0">Title</span>
            <span class="text-sm text-gray-800 font-medium flex-1">{{ task?.title || '—' }}</span>
          </div>
          <div class="flex items-start py-2.5 gap-4">
            <span class="w-24 text-xs font-bold uppercase tracking-wide text-gray-500 pt-0.5 shrink-0">Description</span>
            <span class="text-sm text-gray-600 flex-1 leading-relaxed">{{ task?.description || 'No description.' }}</span>
          </div>
          <div class="flex items-center py-2.5 gap-4">
            <span class="w-24 text-xs font-bold uppercase tracking-wide text-gray-500 shrink-0">Status</span>
            <span
              class="text-xs font-semibold px-2.5 py-1 rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-700': task?.status === 'pending',
                'bg-blue-100 text-blue-700':    task?.status === 'in_progress',
                'bg-green-100 text-green-700':  task?.status === 'completed',
              }"
            >{{ task?.status || '—' }}</span>
          </div>
          <div class="flex items-center py-2.5 gap-4">
            <span class="w-24 text-xs font-bold uppercase tracking-wide text-gray-500 shrink-0">Assigned</span>
            <span class="text-sm text-gray-600 flex-1">{{ task?.assigned_to || 'Unassigned' }}</span>
          </div>
          <div class="flex items-center py-2.5 gap-4">
            <span class="w-24 text-xs font-bold uppercase tracking-wide text-gray-500 shrink-0">Created</span>
            <span class="text-xs text-gray-500 flex-1">{{ task?.created_at ? new Date(task.created_at).toLocaleString() : '—' }}</span>
          </div>
          <div class="flex items-center py-2.5 gap-4">
            <span class="w-24 text-xs font-bold uppercase tracking-wide text-gray-500 shrink-0">Updated</span>
            <span class="text-xs text-gray-500 flex-1">{{ task?.updated_at ? new Date(task.updated_at).toLocaleString() : '—' }}</span>
          </div>
        </div>

        <!-- COMMENTS — 2 COLUMN -->
        <div class="px-6 py-4 border-t border-gray-100">

          <div class="flex items-center gap-2 mb-4">
            <i class="fa-solid fa-comments text-gray-400 text-sm"></i>
            <h3 class="text-sm font-bold text-gray-800">Comments</h3>
            <span class="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ comments.length }} total</span>
          </div>

          <div class="grid grid-cols-2 gap-4">

            <!-- USER COMMENTS -->
            <div>
              <div class="flex items-center gap-1.5 mb-3">
                <div class="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i class="fa-solid fa-user text-indigo-600 text-[9px]"></i>
                </div>
                <span class="text-xs font-bold text-indigo-600 uppercase tracking-wide">User Comments</span>
                <span class="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full font-semibold">{{ userComments.length }}</span>
              </div>

              <div v-if="userComments.length" class="flex flex-col gap-2">
                <div
                  v-for="c in userComments"
                  :key="c.id"
                  class="flex items-start gap-2"
                >
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
                <span class="text-[10px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{{ adminComments.length }}</span>
              </div>

              <div v-if="adminComments.length" class="flex flex-col gap-2">
                <div
                  v-for="c in adminComments"
                  :key="c.id"
                  class="flex items-start gap-2"
                >
                  <div class="w-6 h-6 rounded-full bg-red-100 text-red-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    A
                  </div>
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
        <div class="px-6 pb-4 border-t border-gray-100 pt-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fa-solid fa-pen text-gray-400 text-xs"></i>
            <h3 class="text-sm font-bold text-gray-800">Admin Comment</h3>
          </div>
          <textarea
            v-model="comment"
            rows="2"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 resize-none placeholder-gray-400 transition-all"
            placeholder="Write an admin comment..."
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

      <!-- FOOTER -->
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
import { computed, ref,watch } from "vue";

const isAdminComment = (c) =>
  c.is_admin === true ||
  c.is_admin === 1 ||
  (c.role && c.role.toLowerCase() === "admin");

const props = defineProps({
  show: Boolean,
  task: Object,
  taskComments: Object,
});

const emit = defineEmits(["close", "submitComment"]);

const comment = ref("");

const comments = computed(() => {
  if (!props.task?.id) return [];
  return props.taskComments?.[String(props.task.id)] || [];
});

const userComments = computed(() =>
  comments.value.filter(c => !isAdminComment(c))
);

const adminComments = computed(() =>
  comments.value.filter(c => isAdminComment(c))
);

const submitComment = () => {
  emit("submitComment", comment.value);
  comment.value = "";
};
watch(
  () => props.taskComments,
  () => {},
  { deep: true, immediate: true }
);
</script>