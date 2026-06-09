<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    @click="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      @click.stop
    >

      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <span class="text-sm font-semibold text-gray-800">Task Details</span>
        </div>

        <button
          class="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- BODY (ONE SCROLL FOR EVERYTHING) -->
      <div class="flex-1 overflow-y-auto">

        <!-- TASK DETAILS -->
        <div class="px-6 py-3 divide-y divide-gray-100">

          <div class="flex items-start py-3 gap-4">
            <span class="w-28 text-xs font-bold uppercase text-gray-700">Title</span>
            <span class="text-sm text-gray-600 flex-1">{{ task?.title || '—' }}</span>
          </div>

          <div class="flex items-start py-3 gap-4">
            <span class="w-28 text-xs font-bold uppercase text-gray-700">Description</span>
            <span class="text-sm text-gray-600 flex-1">
              {{ task?.description || 'No description.' }}
            </span>
          </div>

          <div class="flex items-center py-3 gap-4">
            <span class="w-28 text-xs font-bold uppercase text-gray-700">Status</span>

            <span
              class="text-xs font-semibold px-3 py-1 rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-700': task?.status === 'pending',
                'bg-blue-100 text-blue-700': task?.status === 'in_progress',
                'bg-green-100 text-green-700': task?.status === 'completed',
              }"
            >
              {{ task?.status || '—' }}
            </span>
          </div>

          <div class="flex items-center py-3 gap-4">
            <span class="w-28 text-xs font-bold uppercase text-gray-700">Assigned</span>
            <span class="text-sm text-gray-600 flex-1">
              {{ task?.assigned_to_name || task?.assigned_to || 'Unassigned' }}
            </span>
          </div>

          <div class="flex items-center py-3 gap-4">
            <span class="w-28 text-xs font-bold uppercase text-gray-700">Created</span>
            <span class="text-sm text-gray-600 flex-1">
              {{ task?.created_at ? new Date(task.created_at).toLocaleString() : '—' }}
            </span>
          </div>

          <div class="flex items-center py-3 gap-4">
            <span class="w-28 text-xs font-bold uppercase text-gray-700">Updated</span>
            <span class="text-sm text-gray-600 flex-1">
              {{ task?.updated_at ? new Date(task.updated_at).toLocaleString() : '—' }}
            </span>
          </div>

        </div>

        <!-- COMMENTS -->
        <div class="px-6 py-4 border-t border-gray-100">

          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-800">User Comments</h3>
            <span class="text-xs text-gray-500">
              {{ comments.length }} total
            </span>
          </div>

          <div
            v-if="comments.length === 0"
            class="text-xs text-gray-400 italic py-6 text-center bg-gray-50 rounded-lg"
          >
            No comments yet
          </div>

          <div v-else class="space-y-3">

            <div
              v-for="c in comments"
              :key="c.id"
              class="flex gap-3"
            >

              <!-- AVATAR -->
              <div
                class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0"
              >
                {{ c.user_name?.[0]?.toUpperCase() || '?' }}
              </div>

              <!-- COMMENT BUBBLE -->
              <div class="flex flex-col w-full">

                <!-- NAME + TIME ROW -->
                <div class="flex items-center justify-between mb-1">

                  <span class="text-[11px] font-semibold text-indigo-600">
                    {{ c.user_name }}
                  </span>

                  <span class="text-[10px] text-gray-400 ml-6 whitespace-nowrap">
                    {{ c.created_at ? new Date(c.created_at).toLocaleString() : '' }}
                  </span>

                </div>

                <!-- MESSAGE -->
                <div class="bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-sm w-full max-w-full">
                  <p class="text-[12px] text-gray-700 leading-relaxed">
                    {{ c.comment }}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- FOOTER -->
      <div class="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
        <button
          class="px-5 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: Boolean,
  task: Object,
  taskComments: Object
});

defineEmits(["close"]);

const comments = computed(() => {
  if (!props.task?.id) return [];
  return props.taskComments?.[props.task.id] || [];
});
</script>