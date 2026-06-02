<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    @click="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >

      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <span class="text-sm font-semibold text-gray-800">Task Details</span>
        </div>
        <button
          class="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-xs"
          @click="$emit('close')"
        >✕</button>
      </div>

      <!-- BODY — horizontal rows -->
      <div class="px-6 py-2 divide-y divide-gray-100">

        <div class="flex items-start py-3 gap-4">
          <span class="w-28 shrink-0 text-xs font-bold text-gray-700 uppercase tracking-wide pt-0.5">Title</span>
          <span class="text-sm text-gray-600 flex-1">{{ task?.title || '—' }}</span>
        </div>

        <div class="flex items-start py-3 gap-4">
          <span class="w-28 shrink-0 text-xs font-bold text-gray-700 uppercase tracking-wide pt-0.5">Description</span>
          <span class="text-sm text-gray-600 flex-1 leading-relaxed">{{ task?.description || 'No description.' }}</span>
        </div>

        <div class="flex items-center py-3 gap-4">
          <span class="w-28 shrink-0 text-xs font-bold text-gray-700 uppercase tracking-wide">Status</span>
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full"
            :class="{
              'bg-yellow-100 text-yellow-700': task?.status === 'pending',
              'bg-blue-100 text-blue-700':    task?.status === 'in_progress',
              'bg-green-100 text-green-700':  task?.status === 'completed',
            }"
          >{{ task?.status || '—' }}</span>
        </div>

        <div class="flex items-center py-3 gap-4">
          <span class="w-28 shrink-0 text-xs font-bold text-gray-700 uppercase tracking-wide">Assigned To</span>
          <span class="text-sm text-gray-600 flex-1">{{ task?.assigned_to_name || task?.assigned_to || '—' }}</span>
        </div>

        <div class="flex items-center py-3 gap-4">
          <span class="w-28 shrink-0 text-xs font-bold text-gray-700 uppercase tracking-wide">Created At</span>
          <span class="text-sm text-gray-600 flex-1">{{ task?.created_at ? new Date(task.created_at).toLocaleDateString() : '—' }}</span>
        </div>

        <div class="flex items-center py-3 gap-4">
          <span class="w-28 shrink-0 text-xs font-bold text-gray-700 uppercase tracking-wide">Updated At</span>
          <span class="text-sm text-gray-600 flex-1">{{ task?.updated_at ? new Date(task.updated_at).toLocaleDateString() : '—' }}</span>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button
          class="px-5 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
          @click="$emit('close')"
        >Close</button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, task: Object });
defineEmits(["close"]);
</script>