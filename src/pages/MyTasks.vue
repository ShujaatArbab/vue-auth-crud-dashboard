<template>
  <div class="p-4 sm:p-6 bg-white min-h-screen">

    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">My Tasks</h2>
        <p class="text-sm text-gray-400">{{ filteredTasks.length }} total tasks</p>
      </div>

      <div v-if="currentUser" class="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 self-start sm:self-auto">
        <div class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs uppercase shadow-sm flex-shrink-0">
          {{ currentUser.name ? currentUser.name.charAt(0) : 'U' }}
        </div>
        <span class="text-sm font-semibold text-gray-800 truncate max-w-[140px]" :title="currentUser.name">
          {{ currentUser.name }}
        </span>
      </div>
    </div>

    <div class="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-100/70">

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-100/50">
        
        <div class="relative w-full max-w-xs">
          <input
            v-model="search"
            type="text"
            placeholder="Search my tasks..."
            class="w-full pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white"
          />
          <i class="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        </div>

        <div class="relative">
          <i class="fa-solid fa-list absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
          <select
            v-model="perPage"
            class="pl-8 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200 appearance-none cursor-pointer text-gray-700 font-medium"
          >
            <option :value="5">5 per page</option>
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
          </select>
          <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
        </div>
      </div>

      <div v-if="loading" class="px-4 py-12 text-center bg-gray-50/40 border-b border-gray-200">
        <i class="fa-solid fa-spinner fa-spin text-3xl text-green-600 mb-2 block"></i>
        <p class="text-sm text-gray-500 font-medium">Loading tasks...</p>
      </div>

      <div v-else-if="error" class="px-4 py-12 text-center bg-gray-50/40 border-b border-gray-200">
        <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500 mb-2 block"></i>
        <p class="text-sm text-red-500 font-medium">{{ error }}</p>
      </div>

      <template v-else>

        <div class="block md:hidden divide-y divide-gray-200">
          <div
            v-for="task in paginatedTasks"
            :key="task.id"
            class="p-4 bg-gray-50/60 hover:bg-gray-200/50 transition-colors"
          >
            <div class="flex justify-between items-start gap-3 mb-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 break-words">{{ task.title }}</p>
                <p class="text-[11px] text-gray-400 mt-1.5">
                  {{ task.created_at ? new Date(task.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—' }}
                </p>
              </div>

              <span
                class="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 uppercase"
                :class="{
                  'bg-yellow-100 text-yellow-700': task.status === 'pending',
                  'bg-blue-100 text-blue-700':    task.status === 'in_progress',
                  'bg-green-100 text-green-700':  task.status === 'completed'
                }"
              >
                {{ task.status?.replace('_',' ') }}
              </span>
            </div>

            <div class="mt-4 flex flex-col sm:flex-row items-center gap-2 w-full">
              <button
                class="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all font-medium"
                @click="openComment(task)"
              >
                <i class="fa-regular fa-comment text-[11px]"></i> Comment
              </button>

              <div class="relative w-full">
                <select
                  :value="task.status"
                  @change="updateStatus(task.id, $event.target.value)"
                  class="w-full pl-3 pr-8 py-2 text-xs rounded-lg border appearance-none cursor-pointer font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1"
                  :class="{
                    'bg-yellow-50 border-yellow-300 text-yellow-800 focus:ring-yellow-200': task.status === 'pending',
                    'bg-blue-50 border-blue-300 text-blue-800 focus:ring-blue-200':       task.status === 'in_progress',
                    'bg-green-50 border-green-300 text-green-800 focus:ring-green-200':    task.status === 'completed'
                  }"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <i 
                  class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
                  :class="{
                    'text-yellow-600': task.status === 'pending',
                    'text-blue-600':    task.status === 'in_progress',
                    'text-green-600':  task.status === 'completed'
                  }"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left table-fixed">
            <thead>
              <tr class="bg-gray-200/60 border-b border-gray-200">
                <th class="w-[32%] px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                <th class="w-[18%] px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                <th class="w-[18%] px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th class="w-[14%] px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Comment</th>
                <th class="w-[18%] px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Change Status</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-200 bg-gray-50/60">
              <tr
                v-for="task in paginatedTasks"
                :key="task.id"
                class="hover:bg-gray-200/40 transition-colors group cursor-default"
              >
                <td class="px-5 py-3.5 truncate">
                  <span class="text-sm text-gray-600" :title="task.title">{{ task.title }}</span>
                </td>

                <td class="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {{ task.created_at ? new Date(task.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—' }}
                </td>

                <td class="px-5 py-3.5">
                  <span
                    class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap uppercase"
                    :class="{
                      'bg-yellow-100 text-yellow-700': task.status === 'pending',
                      'bg-blue-100 text-blue-700':    task.status === 'in_progress',
                      'bg-green-100 text-green-700':  task.status === 'completed'
                    }"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="{
                        'bg-yellow-500': task.status === 'pending',
                        'bg-blue-500':   task.status === 'in_progress',
                        'bg-green-500':  task.status === 'completed'
                      }"
                    ></span>
                    {{ task.status?.replace('_', ' ') }}
                  </span>
                </td>

                <td class="px-5 py-3.5 text-center">
                  <button
                    title="Comment"
                    class="w-8 h-8 inline-flex items-center justify-center rounded-lg text-green-600 hover:bg-white hover:text-green-700 border border-transparent hover:border-gray-200 shadow-sm-hover transition-all flex-shrink-0"
                    @click="openComment(task)"
                  >
                    <i class="fa-regular fa-comment-dots text-sm"></i>
                  </button>
                </td>

                <td class="px-5 py-3.5 text-right">
                  <div class="relative inline-block text-left">
                    <select
                      :value="task.status"
                      @change="updateStatus(task.id, $event.target.value)"
                      class="pl-2 pr-6 py-1 text-xs font-semibold rounded-md border appearance-none cursor-pointer focus:outline-none transition-all"
                      :class="{
                        'bg-yellow-50 border-yellow-300 text-yellow-700': task.status === 'pending',
                        'bg-blue-50 border-blue-300 text-blue-700':       task.status === 'in_progress',
                        'bg-green-50 border-green-300 text-green-700':    task.status === 'completed'
                      }"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <i 
                      class="fa-solid fa-chevron-down absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none"
                      :class="{
                        'text-yellow-600': task.status === 'pending',
                        'text-blue-600':    task.status === 'in_progress',
                        'text-green-600':  task.status === 'completed'
                      }"
                    ></i>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedTasks.length === 0">
                <td colspan="5" class="px-4 py-12 text-center bg-gray-50/40">
                  <i class="fa-regular fa-folder-open text-3xl text-gray-400 mb-2 block"></i>
                  <p class="text-sm text-gray-400">No tasks found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-100/50">
          <p class="text-xs text-gray-500">
            Showing <span class="font-semibold text-gray-700">{{ rangeStart }}–{{ rangeEnd }}</span> of <span class="font-semibold text-gray-700">{{ filteredTasks.length }}</span> tasks
          </p>
          
          <div class="flex items-center gap-1.5">
            <button
              class="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              :disabled="currentPage === 1"
              @click="goPage(currentPage - 1)"
            >
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>

            <span class="px-3 py-1 rounded-lg text-sm bg-green-700 text-white font-semibold min-w-[36px] text-center shadow-sm">
              {{ currentPage }}
            </span>

            <button
              class="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              :disabled="currentPage === totalPages"
              @click="goPage(currentPage + 1)"
            >
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>

      </template>
    </div>

    <div
      v-if="showToast"
      class="fixed bottom-5 right-5 z-[9999] border shadow-2xl px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3"
      :class="{
        'bg-green-50 border-green-400 text-green-900': toastType === 'success',
        'bg-red-50 border-red-400 text-red-900':       toastType === 'error'
      }"
    >
      <i 
        class="text-base flex-shrink-0" 
        :class="toastType === 'success' ? 'fa-solid fa-circle-check text-green-600' : 'fa-solid fa-circle-xmark text-red-600'"
      ></i>
      <span class="text-sm font-semibold tracking-wide">{{ toastMessage }}</span>
    </div>

    <CommentModel
      :show="showCommentModal"
      :task="selectedTask"
      :task-comments="taskComments"
      @close="showCommentModal = false"
      @submitComment="submitComment"
    />

  </div>
</template>

<script setup>
import { useMyTasks } from "../composables/useMyTasks";
import CommentModel from "../components/CommentModel.vue";

const {
  loading,
  error,
  search,
  perPage,
  currentPage,
  paginatedTasks,
  rangeStart,
  rangeEnd,
  totalPages,
  filteredTasks,
  selectedTask,
  goPage,
  showCommentModal,
  openComment,
  updateStatus,
  showToast,
  toastMessage,
  toastType,
  taskComments,
  submitComment,
  currentUser 
} = useMyTasks();
</script>