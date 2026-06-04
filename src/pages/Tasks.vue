<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

    <!-- TOP BAR -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Tasks</h2>
        <p class="text-sm text-gray-500">{{ filteredTasks.length }} total tasks</p>
      </div>
      <button
        class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto"
        @click="showCreateModal = !showCreateModal"
      >+ Create Task</button>
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white border rounded-xl overflow-hidden shadow-sm">

      <!-- TOPBAR -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border-b bg-gray-50">
        <input
          v-model="search"
          type="text"
          placeholder="Search task by title..."
          class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <select
          v-model="perPage"
          class="w-full sm:w-auto max-w-[120px] px-2 py-1 border rounded-lg text-sm bg-white"
        >
          <option :value="5">Show 5</option>
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
          <option :value="50">Show 50</option>
        </select>
      </div>

      <!-- TABLE -->
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Title</th>
              <th class="p-3">Assigned To</th>
              <th class="p-3">Created At</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in paginatedTasks"
              :key="task.id"
              class="border-t hover:bg-gray-50 align-top"
            >
              <td class="p-3 text-sm font-medium text-gray-800">{{ task.title }}</td>
              <td class="p-3 text-sm text-gray-600">{{ task.assigned_to_name || "Unassigned" }}</td>
              <td class="p-3 text-sm text-gray-500">{{ formatDate(task.created_at) }}</td>

              <!-- ACTIONS -->
              <td class="p-3">
                <div class="flex flex-col gap-2">

                  <!-- BUTTONS ROW -->
                  <div class="flex flex-wrap gap-1.5">

                    <button
                      class="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-all"
                      @click="handleViewTask(task.id)"
                    >View</button>

                    <button
                      class="px-3 py-1 text-xs rounded-md bg-green-700 text-white hover:bg-green-600 transition-all"
                      @click="openAssignModal(task.id)"
                    >Assign</button>

                    <button
                      class="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-500 transition-all"
                      @click="handleDeleteTask(task.id)"
                    >Delete</button>

                    <!--  COMMENT BUTTON — always visible, toggles preview on click -->
                    <button
                      class="flex items-center gap-1.5 px-3 py-1 text-xs rounded-md border transition-all"
                      :class="taskComments[task.id]?.length
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'"
                      @click="toggleComments(task.id)"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h6m-6 8l4-4h7a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2l2 2z"/>
                      </svg>
                      {{ taskComments[task.id]?.length || 0 }} Comments
                    </button>

                  </div>

                  <!--  COMMENT PREVIEW — only shows when toggled AND has comments -->
                  <!-- ✅ Loop all comments -->
<div
  v-if="visibleComments[task.id] && taskComments[task.id]?.length"
  class="flex flex-col gap-1.5 max-w-xs"
>
  <div
    v-for="c in taskComments[task.id]"
    :key="c.id"
    class="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
  >
    <div class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
      {{ c.user_name?.[0]?.toUpperCase() || '?' }}
    </div>
    <div class="min-w-0">
      <span class="text-[11px] font-semibold text-gray-700">{{ c.user_name }}</span>
      <p class="text-[11px] text-gray-500 truncate">{{ c.comment }}</p>
    </div>
  </div>
</div>

                  <!--  NO COMMENTS STATE — shown when toggled but no comments -->
                  <div
                    v-if="visibleComments[task.id] && !taskComments[task.id]?.length"
                    class="text-[11px] text-gray-400 px-1"
                  >
                    No comments yet.
                  </div>

                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 border-t">
        <div class="text-sm text-gray-500">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredTasks.length }}
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >‹</button>
          <button class="px-3 py-1 border rounded text-sm bg-green-700 text-white">{{ currentPage }}</button>
          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >›</button>
        </div>
      </div>

    </div>

  </div>

  <!-- MODALS -->
  <ViewTaskModal
    :show="showModal"
    :task="selectedTask"
    @close="showModal = false"
  />
  <AssignTaskModel
    :show="showAssignModal"
    :users="users"
    @close="showAssignModal = false"
    @selectUser="handleAssignTask"
  />
  <CreateTaskModel
    :show="showCreateModal"
    @close="showCreateModal = false"
    @submit="handleCreateTask"
  />
  <CommentModel
    :show="showCommentModal"
    :task="selectedCommentTask"
    @close="showCommentModal = false"
  />
</template>

<script setup>
import { useTasks } from "../composables/useTasks";
import ViewTaskModal   from "../components/ViewTaskModel.vue";
import AssignTaskModel from "../components/AssignTaskModel.vue";
import CreateTaskModel from "../components/CreateTaskModel.vue";
import CommentModel    from "../components/CommentModel.vue";

const {
  search, perPage,
  paginatedTasks, filteredTasks,
  currentPage, totalPages,
  rangeStart, rangeEnd,
  goPage, viewTask, assignTask, formatDate,
  selectedTask, showModal, handleViewTask,
  loadUsers, showAssignModal, users,
  handleDeleteTask, handleCreateTask,
  showCreateModal, openAssignModal, handleAssignTask,
  taskComments, showCommentModal,
  selectedCommentTask, openCommentModal,
  visibleComments,
  toggleComments,
  
} = useTasks();
</script>